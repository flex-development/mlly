/**
 * @file resolveModule
 * @module mlly/lib/resolveModule
 */

import constant from '#internal/constant'
import identity from '#internal/identity'
import isPromise from '#internal/is-promise'
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
  Awaitable,
  ModuleId,
  ResolveModuleOptions
} from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

export default resolveModule

/**
 * Resolve a module `specifier`.
 *
 * Implements the `ESM_RESOLVE` algorithm, mostly 😉.
 *
 * Adds support for:
 *
 * - Extensionless and directory index resolution
 * - Path alias resolution
 * - Rewrite file extensions
 * - Scopeless `@types/*` resolution (i.e. `unist` -> `@types/unist`)
 *
 * > 👉 **Note**: Returns a promise if {@linkcode moduleResolve}
 * > returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode ModuleId}
 * @see {@linkcode NodeError}
 * @see {@linkcode ResolveModuleOptions}
 *
 * @template {Awaitable<URL>} T
 *  The resolved URL
 *
 * @this {void}
 *
 * @param {string} specifier
 *  The module specifier to resolve
 * @param {ModuleId} parent
 *  The URL of the parent module
 * @param {ResolveModuleOptions | null | undefined} [options]
 *  Options for module resolution
 * @return {T}
 *  The resolved URL
 * @throws {NodeError}
 */
function resolveModule<T extends Awaitable<URL>>(
  this: void,
  specifier: string,
  parent: ModuleId,
  options?: ResolveModuleOptions | null | undefined
): T

/**
 * Resolve a module `specifier`.
 *
 * Implements the `ESM_RESOLVE` algorithm, mostly 😉.
 *
 * Adds support for:
 *
 * - Extensionless and directory index resolution
 * - Path alias resolution
 * - Rewrite file extensions
 * - Scopeless `@types/*` resolution (i.e. `unist` -> `@types/unist`)
 *
 * > 👉 **Note**: Returns a promise if {@linkcode moduleResolve}
 * > returns a promise.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode ModuleId}
 * @see {@linkcode NodeError}
 * @see {@linkcode ResolveModuleOptions}
 *
 * @this {void}
 *
 * @param {string} specifier
 *  The module specifier to resolve
 * @param {ModuleId} parent
 *  The URL of the parent module
 * @param {ResolveModuleOptions | null | undefined} [options]
 *  Options for module resolution
 * @return {Awaitable<URL>}
 *  The resolved URL
 * @throws {NodeError}
 */
function resolveModule(
  this: void,
  specifier: string,
  parent: ModuleId,
  options?: ResolveModuleOptions | null | undefined
): Awaitable<URL> {
  specifier = resolveAlias(specifier, { ...options, parent }) ?? specifier

  /**
   * The resolved URL.
   *
   * @var {Awaitable<URL>} resolved
   */
  let resolved: Awaitable<URL>

  try {
    resolved = moduleResolve(
      specifier,
      parent,
      options?.conditions,
      options?.mainFields,
      options?.preserveSymlinks,
      options?.fs
    )
  } catch (e: unknown) {
    return retry(e, specifier, parent, options)
  }

  if (isPromise(resolved)) {
    return resolved.then(
      (url: URL): URL => rewriteExtension(url, specifier, options?.ext),
      (e: unknown): Awaitable<URL> => retry(e, specifier, parent, options)
    )
  }

  return rewriteExtension(resolved, specifier, options?.ext)
}

/**
 * @this {void}
 *
 * @param {unknown} e
 *  The error to handle
 * @param {string} specifier
 *  The module specifier to resolve
 * @param {ModuleId} parent
 *  The URL of the parent module
 * @param {ResolveModuleOptions | null | undefined} [options]
 *  Resolution options
 * @return {Awaitable<URL>}
 *  The resolved URL
 * @throws {NodeError}
 */
function retry(
  this: void,
  e: unknown,
  specifier: string,
  parent: ModuleId,
  options?: ResolveModuleOptions | null | undefined
): Awaitable<URL> {
  /**
   * The list of error codes to ignore.
   *
   * @const {Set<Code>} ignore
   */
  const ignore: Set<Code> = new Set<Code>([
    codes.ERR_MODULE_NOT_FOUND,
    codes.ERR_UNSUPPORTED_DIR_IMPORT
  ])

  if (isNodeError(e) && ignore.has(e.code)) {
    /**
     * The module extensions to probe for.
     *
     * @const {string[]} extensions
     */
    const extensions: string[] = [...(options?.extensions ?? defaultExtensions)]

    /**
     * The promises to resolve.
     *
     * > 👉 **Note**: Only used if {@linkcode moduleResolve} returns a promise.
     *
     * @const {Awaitable<URL | undefined>} promises
     */
    const promises: Awaitable<URL | undefined>[] = []

    /**
     * The resolved URL.
     *
     * @var {Awaitable<URL>} resolved
     */
    let resolved: Awaitable<URL>

    /**
     * The module specifiers to try resolving.
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
    for (let attempt of tries) {
      try {
        resolved = moduleResolve(
          attempt,
          parent,
          options?.conditions,
          options?.mainFields,
          options?.preserveSymlinks,
          options?.fs
        )

        if (!isPromise(resolved)) {
          return rewriteExtension(resolved, specifier, options?.ext)
        }
      } catch {
        continue // swallow error to continue resolution attempts.
      }

      // collect promises to resolve.
      promises.push(resolved.then(identity, constant(undefined)))
    }

    if (promises.length) {
      return Promise.all(promises).then(resolved => {
        for (const url of resolved) {
          if (url) return rewriteExtension(url, specifier, options?.ext)
        }

        throw e // could not resolve specifier.
      })
    }
  }

  throw e
}

/**
 * @this {void}
 *
 * @param {URL} url
 *  The resolved URL
 * @param {string} specifier
 *  The module specifier being resolved
 * @param {ResolveModuleOptions['ext']} [ext]
 *  The replacement file extension record
 *  or a function that returns a file extension
 * @return {URL}
 *  The modified `url`
 */
function rewriteExtension(
  this: void,
  url: URL,
  specifier: string,
  ext?: ResolveModuleOptions['ext']
): URL {
  if (url.protocol === 'file:' && ext !== undefined) {
    /**
     * The replacement file extension.
     *
     * @var {string | false | null | undefined} replacer
     */
    let replacer: string | false | null | undefined

    if (typeof ext === 'function') {
      replacer = ext(url, specifier)
    } else if (typeof ext === 'object' && ext) {
      replacer = pathe.extToValue(url.href, ext)
    } else {
      replacer = ext
    }

    // rewrite file extension.
    url.href = pathe.changeExt(url.href, replacer || null)

    // replace '/index' ending with '/'.
    url = new URL(pathe.toPosix(url.href).replace(/\/index$/, pathe.sep))
  }

  return url
}
