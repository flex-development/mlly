/**
 * @file resolveModule
 * @module mlly/utils/resolveModule
 */

import { CONDITIONS, RESOLVE_EXTENSIONS } from '#src/constants'
import type { ResolveOptions } from '#src/interfaces'
import type { ModuleSpecifierType } from '#src/types'
import isBuiltin from '@flex-development/is-builtin'
import pathe from '@flex-development/pathe'
import { moduleResolve, type ErrnoException } from 'import-meta-resolve'
import { URL, pathToFileURL } from 'node:url'
import toBareSpecifier from './to-bare-specifier'
import toRelativeSpecifier from './to-relative-specifier'

/**
 * Resolves `specifier` according to the [ESM Resolver algorithm][1], mostly 😉.
 *
 * Adds support for:
 *
 * - Resolving without file extensions and explicit `/index` usage
 * - Resolving `@types/*` with **and** without explicit `@types/*` usage
 * - Converting resolved modules into [bare][2] and [relative][3] specifiers
 * - Removing and replacing file extensions
 *
 * [1]: https://nodejs.org/api/esm.html#esm_resolver_algorithm
 * [2]: {@link ./to-bare-specifier.ts}
 * [3]: {@link ./to-relative-specifier.ts}
 *
 * @see {@linkcode ResolveOptions}
 * @see {@linkcode ErrnoException}
 *
 * @async
 *
 * @param {string} specifier - Module specifier to resolve
 * @param {ResolveOptions} [options={}] - Resolve options
 * @return {Promise<string>} Resolved module
 * @throws {ErrnoException}
 */
const resolveModule = async (
  specifier: string,
  options: ResolveOptions = {}
): Promise<string> => {
  const {
    conditions = CONDITIONS,
    ext,
    extensions = RESOLVE_EXTENSIONS,
    parent = import.meta.url,
    preserveSymlinks = false,
    ...opts
  } = options

  /**
   * Parent module URL to resolve {@linkcode specifier} from.
   *
   * @const {URL} base
   */
  const base: URL =
    typeof parent === 'string'
      ? parent.startsWith('file:')
        ? new URL(parent)
        : pathToFileURL(parent)
      : parent

  /**
   * Module specifiers to try resolving.
   *
   * @const {string[]} tries
   */
  const tries: string[] =
    isBuiltin(specifier) || /^(?:data|https?):/.test(specifier)
      ? []
      : extensions.flatMap(ext => {
          return [specifier + ext, specifier + '/index' + ext].flatMap($try => {
            return [$try, '@types/' + $try]
          })
        })

  // ensure attempt to resolve original specifier is first
  tries.unshift(specifier)

  /**
   * {@linkcode moduleResolve} error codes to ignore when attempting to resolve
   * module ids without URL schemes.
   *
   * **Note**: If an error is thrown, it'll be reported **_after_** all module
   * ids in {@linkcode tries} have been evaluated.
   *
   * @const {Set<NonNullable<ErrnoException['code']>>} ignore
   */
  const ignore: Set<NonNullable<ErrnoException['code']>> = new Set([
    'ERR_MODULE_NOT_FOUND',
    'ERR_PACKAGE_PATH_NOT_EXPORTED',
    'ERR_UNSUPPORTED_DIR_IMPORT'
  ])

  /**
   * Resolution error.
   *
   * @var {ErrnoException | undefined} error
   */
  let error: ErrnoException | undefined

  /**
   * Resolved module specifier.
   *
   * @var {string | undefined} resolved
   */
  let resolved: string | undefined

  // try module resolution
  for (const id of tries) {
    try {
      resolved = moduleResolve(
        id,
        base,
        new Set(conditions),
        preserveSymlinks
      ).href
    } catch (e: unknown) {
      if (id === specifier) error = e as ErrnoException
      if (ignore.has((e as ErrnoException).code!)) continue

      throw e
    }

    if (resolved) break
  }

  // throw error if specifier could not be resolved
  if (!resolved) throw error!

  // return resolved early if extension or type logic should be skipped
  if (isBuiltin(resolved) || /^(?:data|https?):/.test(resolved)) return resolved

  /**
   * Module specifier type.
   *
   * @const {ModuleSpecifierType} type
   */
  const type: ModuleSpecifierType =
    typeof opts.type === 'function'
      ? await opts.type(resolved)
      : opts.type ?? 'absolute'

  // convert resolved into bare specifier
  if (type === 'bare') resolved = await toBareSpecifier(resolved, conditions)

  // convert resolved into relative specifier
  if (type === 'relative') resolved = toRelativeSpecifier(resolved, parent)

  // remove or replace file extension
  if (ext !== undefined) {
    if (ext === false) {
      resolved = pathe.removeExt(resolved, pathe.extname(resolved))
    } else if (type === 'relative') {
      resolved = pathe.changeExt(
        resolved,
        typeof ext === 'function' ? await ext(specifier, resolved) : ext
      )
    }

    resolved = resolved.replace(/\/index$/, '')
  }

  return resolved
}

export default resolveModule
