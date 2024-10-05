/**
 * @file resolveModule
 * @module mlly/lib/resolveModule
 */

import defaultExtensions from '#lib/default-extensions'
import resolveAlias from '#lib/resolve-alias'
import { moduleResolve } from '#lib/resolver'
import {
  codes,
  isNodeError,
  type Code,
  type ErrModuleNotFound,
  type NodeError
} from '@flex-development/errnode'
import type {
  ChangeExtFn,
  ModuleId,
  ResolveModuleOptions
} from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

export default resolveModule

/**
 * Resolve a module `specifier` according to the [ESM Resolver algorithm][esm],
 * mostly 😉.
 *
 * Adds support for:
 *
 * - Changing file extensions
 * - Directory index resolution
 * - Extensionless file resolution
 * - Path alias resolution
 * - Scopeless `@types/*` resolution (i.e. `unist` -> `@types/unist`)
 *
 * [esm]: https://nodejs.org/api/esm.html#esm_resolver_algorithm
 *
 * @see {@linkcode ModuleId}
 * @see {@linkcode NodeError}
 * @see {@linkcode ResolveModuleOptions}
 *
 * @param {string} specifier
 *  The module specifier to resolve
 * @param {ModuleId} parent
 *  URL of parent module
 * @param {ResolveModuleOptions | null | undefined} [options]
 *  Resolution options
 * @return {URL}
 *  Resolved URL
 * @throws {NodeError}
 */
function resolveModule(
  specifier: string,
  parent: ModuleId,
  options?: ResolveModuleOptions | null | undefined
): URL {
  try {
    return changeExt(moduleResolve(
      resolveAlias(specifier, { ...options, parent }) ?? specifier,
      parent,
      options?.conditions,
      options?.mainFields,
      options?.preserveSymlinks,
      options?.fs
    ), specifier, options?.ext)
  } catch (e: unknown) {
    /**
     * Error codes to ignore when attempting to resolve {@linkcode specifier}.
     *
     * @const {Set<Code>} ignore
     */
    const ignore: Set<Code> = new Set<Code>([
      codes.ERR_MODULE_NOT_FOUND,
      codes.ERR_UNSUPPORTED_DIR_IMPORT
    ])

    if (isNodeError(e) && ignore.has(e.code)) {
      /**
       * Module extensions to probe for.
       *
       * @const {string[]} extensions
       */
      const extensions: string[] = [
        ...(options?.extensions ?? defaultExtensions)
      ]

      /**
       * Module specifiers to try resolving.
       *
       * @var {string[]} tries
       */
      let tries: string[] = []

      // add @types resolution attempts if package resolution failed.
      if (
        e.code === codes.ERR_MODULE_NOT_FOUND &&
        !(e as ErrModuleNotFound).url
      ) {
        tries = [
          specifier.startsWith('@types/') ? specifier : '@types/' + specifier
        ].flatMap(specifier => [
          specifier,
          specifier + pathe.sep + 'index.d.ts',
          specifier + pathe.sep + 'index.d.mts',
          specifier + pathe.sep + 'index.d.cts'
        ])
      }

      // add extensionless file resolution attempts if file resolution failed.
      if (
        e.code === codes.ERR_MODULE_NOT_FOUND &&
        (e as ErrModuleNotFound).url
      ) {
        tries = extensions.map(ext => specifier + pathe.formatExt(ext))
      }

      // add directory index resolution attempts if directory resolution failed.
      if (e.code === codes.ERR_UNSUPPORTED_DIR_IMPORT) {
        tries = extensions.map(ext => {
          return specifier + pathe.sep + 'index' + pathe.formatExt(ext)
        })
      }

      // try module resolution attempts.
      for (const attempt of tries) {
        try {
          return changeExt(moduleResolve(
            attempt,
            parent,
            options?.conditions,
            options?.mainFields,
            options?.preserveSymlinks,
            options?.fs
          ), specifier, options?.ext)
        } catch {
          // swallow error to continue resolution attempts.
          continue
        }
      }
    }

    throw e
  }
}

/**
 * Change the file extension of `url`.
 *
 * @internal
 *
 * @param {URL} url
 *  The resolved module URL
 * @param {string} specifier
 *  The module specifier being resolved
 * @param {ChangeExtFn | string | null | undefined} [ext]
 *  Replacement file extension or function that returns a file extension
 * @return {URL}
 *  `url`
 */
function changeExt(
  url: URL,
  specifier: string,
  ext?: ChangeExtFn | string | null | undefined
): URL {
  if (url.protocol === 'file:' && ext !== undefined) {
    url.href = typeof ext === 'function'
      ? pathe.changeExt(url.href, ext(url, specifier))
      : pathe.changeExt(url.href, ext)

    url = new URL(pathe.toPosix(url.href).replace(/\/index$/, pathe.sep))
  }

  return url
}
