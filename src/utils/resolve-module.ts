/**
 * @file resolveModule
 * @module mlly/utils/resolveModule
 */

import type { ResolveModuleOptions } from '#src/interfaces'
import isFunction from '#src/internal/is-function'
import Resolver from '#src/internal/resolver'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import { isBuiltin } from '@flex-development/is-builtin'
import pathe from '@flex-development/pathe'
import type { Nullable } from '@flex-development/tutils'
import { URL, fileURLToPath } from 'node:url'
import CONDITIONS from './conditions'
import RESOLVE_EXTENSIONS from './resolve-extensions'

/**
 * Resolves `specifier` according to the [ESM Resolver algorithm][1], mostly 😉.
 *
 * Adds support for:
 *
 * - Extensionless file and directory index resolution
 * - Replacing file extensions
 *
 * Other differences between Node.js:
 *
 * - [Subpath import][2] targets (that are strings) must be relative to the
 *   current working directory (e.g. `'./src/index.ts'`, `'./src/*.ts'`) or
 *   start with a [NPM valid package name][3]. See [`nodejs/node#40579`][4] for
 *   details.
 *
 * [1]: https://nodejs.org/api/esm.html#esm_resolver_algorithm
 * [2]: https://nodejs.org/api/packages.html#subpath-imports
 * [3]: https://regex101.com/r/BHcJfc
 * [4]: https://github.com/nodejs/node/issues/40579
 *
 * @see {@linkcode NodeError}
 * @see {@linkcode ResolveModuleOptions}
 * @see {@linkcode URL}
 *
 * @async
 *
 * @param {string} specifier - Module specifier to resolve
 * @param {ResolveModuleOptions} [options={}] - Module resolution options
 * @return {Promise<URL>} Resolved module URL
 * @throws {NodeError}
 */
const resolveModule = async (
  specifier: string,
  options: ResolveModuleOptions = {}
): Promise<URL> => {
  const {
    condition = 'default',
    conditions = CONDITIONS,
    extensions = RESOLVE_EXTENSIONS,
    parent = import.meta.url,
    preserveSymlinks = false
  } = options

  /**
   * Module resolver.
   *
   * @const {Resolver} resolver
   */
  const resolver: Resolver = new Resolver()

  /**
   * Module ids to try resolving.
   *
   * @const {string[]} tries
   */
  const tries: string[] =
    isBuiltin(specifier) ||
    (/^\S+:/.test(specifier) && !specifier.startsWith('file:'))
      ? []
      : [...extensions]
          .flatMap(ext => [
            specifier + (ext = pathe.formatExt(ext)),
            specifier.startsWith('#') ? specifier + '/index' : '',
            specifier + '/index' + ext
          ])
          .filter(id => id.length > 0)

  // ensure attempt to resolve original specifier is first
  tries.unshift(specifier)

  /**
   * Error codes to ignore when attempting to resolve {@linkcode specifier}.
   *
   * **Note**: If an error is thrown, it'll be reported **_after_** all module
   * ids in {@linkcode tries} have been evaluated.
   *
   * @const {Set<ErrorCode>} ignore
   */
  const ignore: Set<ErrorCode> = new Set<ErrorCode>([
    ErrorCode.ERR_MODULE_NOT_FOUND,
    ErrorCode.ERR_PACKAGE_PATH_NOT_EXPORTED,
    ErrorCode.ERR_UNSUPPORTED_DIR_IMPORT
  ])

  /**
   * Module resolution error.
   *
   * @var {NodeError} error
   */
  let error: NodeError

  /**
   * Resolved module URL.
   *
   * @var {Nullable<URL>} url
   */
  let url: Nullable<URL> = null

  // try module resolution
  for (const id of tries) {
    try {
      url = resolver.resolveModule(
        id,
        parent,
        condition,
        new Set(conditions),
        preserveSymlinks
      )
    } catch (e: unknown) {
      url = null
      if (id === specifier) error = e as NodeError
      if (!ignore.has((e as NodeError).code)) throw e
    }

    // stop resolution attempts if module was resolved
    if (url) break
  }

  // throw if module was not resolved
  if (!url) throw error!

  // replace file extension
  if (url.protocol === 'file:') {
    let { ext } = options

    // get replacement extension
    ext = isFunction(ext) ? await ext(specifier, url) : ext

    // replace file extension in url href and pathname
    url.href = pathe.changeExt(url.href, ext).replace(/\/index$/, '')
    url.pathname = fileURLToPath(url.href)
  }

  return url
}

export default resolveModule
