/**
 * @file lookupPackageScope
 * @module mlly/lib/lookupPackageScope
 */

import isPromise from '#internal/is-promise'
import canParseUrl from '#lib/can-parse-url'
import isFile from '#lib/is-file'
import isModuleId from '#lib/is-module-id'
import root from '#lib/root'
import toUrl from '#lib/to-url'
import type { Awaitable, FileSystem, ModuleId } from '@flex-development/mlly'
import pathe, { type EmptyString } from '@flex-development/pathe'

export default lookupPackageScope

/**
 * Get the package scope URL for a module `url`.
 *
 * @see {@linkcode EmptyString}
 *
 * @this {void}
 *
 * @param {EmptyString | null | undefined} url
 *  The URL of the module to scope
 * @return {null}
 *  The URL of nearest directory containing a `package.json` file
 */
function lookupPackageScope(
  this: void,
  url: EmptyString | null | undefined
): null

/**
 * Get the package scope URL for a module `url`.
 *
 * Implements the `LOOKUP_PACKAGE_SCOPE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if `fs.stat` is async.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode FileSystem}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm-specification
 *
 * @template {Awaitable<URL | null>} T
 *  The resolved URL
 *
 * @this {void}
 *
 * @param {ModuleId | null | undefined} url
 *  The URL of the module to scope
 * @param {ModuleId | null | undefined} [end]
 *  The URL of the directory to end search at, defaults to {@linkcode root}
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {T}
 *  The URL of nearest directory containing a `package.json` file
 */
function lookupPackageScope<T extends Awaitable<URL | null>>(
  this: void,
  url: ModuleId | null | undefined,
  end?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): T

/**
 * Get the package scope URL for a module `url`.
 *
 * Implements the `LOOKUP_PACKAGE_SCOPE` algorithm.
 *
 * > 👉 **Note**: Returns a promise if `fs.stat` is async.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode FileSystem}
 * @see {@linkcode ModuleId}
 * @see https://github.com/nodejs/node/blob/v22.9.0/doc/api/esm.md#resolution-algorithm-specification
 *
 * @this {void}
 *
 * @param {ModuleId | null | undefined} url
 *  The URL of the module to scope
 * @param {ModuleId | null | undefined} [end]
 *  The URL of the directory to end search at, defaults to {@linkcode root}
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {Awaitable<URL | null>}
 *  The URL of nearest directory containing a `package.json` file
 */
function lookupPackageScope(
  this: void,
  url: ModuleId | null | undefined,
  end?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): Awaitable<URL | null> {
  if (isModuleId(url) && canParseUrl(url)) {
    /**
     * The promise context.
     *
     * > 👉 **Note**: Only used if {@linkcode isFile} returns a promise.
     *
     * @const {{ scope: URL | null }} context
     */
    const context: { scope: URL | null } = { scope: null }

    /**
     * The promises to resolve.
     *
     * > 👉 **Note**: Only used if {@linkcode isFile} returns a promise.
     *
     * @const {Awaitable<undefined>[]} promises
     */
    const promises: Awaitable<undefined>[] = []

    /**
     * The current package scope URL.
     *
     * @var {URL} directory
     */
    let dir: URL = new URL(url)

    /**
     * Whether the current file exists.
     *
     * @var {Awaitable<boolean>} exists
     */
    let exists: Awaitable<boolean>

    while (String(dir) !== String(end ?? root)) {
      // reset directory to parent directory url.
      dir = toUrl(pathe.dot.repeat(/[/\\]$/.test(dir.pathname) ? 2 : 1), dir)

      // end search early at node_modules.
      if (/node_modules[/\\]$/.test(dir.pathname)) break

      /**
       * The URL of the package manifest.
       *
       * @const {URL} packageUrl
       */
      const packageUrl: URL = new URL('package.json', dir)

      /**
       * The package scope URL.
       *
       * @const {URL} scopeUrl
       */
      const scopeUrl: URL = new URL(pathe.dot, packageUrl)

      // check if package manifest exists.
      exists = isFile(packageUrl, fs)

      // collect promises, or return scope url if manifest exists.
      if (isPromise<boolean>(exists)) {
        promises.push(exists.then(isFile => {
          if (!isFile || context.scope) return
          return context.scope = scopeUrl, void 0
        }))
      } else if (exists) {
        return scopeUrl
      }
    }

    // resolve scope url.
    if (promises.length) return Promise.all(promises).then(() => context.scope)
  }

  return null
}
