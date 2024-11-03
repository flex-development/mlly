/**
 * @file lookupPackageScope
 * @module mlly/lib/lookupPackageScope
 */

import isFile from '#lib/is-file'
import root from '#lib/root'
import type { FileSystem, ModuleId } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

/**
 * Get the package scope URL for the given module `url`.
 *
 * Implements the `LOOKUP_PACKAGE_SCOPE` algorithm.
 *
 * @see {@linkcode FileSystem}
 * @see {@linkcode ModuleId}
 *
 * @async
 *
 * @param {ModuleId} url
 *  URL of module to get package scope for
 * @param {ModuleId | null | undefined} [end]
 *  URL of directory to end search, defaults to {@linkcode root}
 * @param {FileSystem | null | undefined} [fs]
 *  File system API
 * @return {Promise<URL | null>}
 *  URL of nearest directory containing `package.json` file or `null`
 */
async function lookupPackageScope(
  url: ModuleId,
  end?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): Promise<URL | null> {
  /**
   * Scope URL.
   *
   * @var {URL} scopeUrl
   */
  let scopeUrl: URL = new URL(url)

  while (String(scopeUrl) !== String(end ?? root)) {
    // set scopeUrl to URL of parent directory
    scopeUrl = /[/\\]$/.test(scopeUrl.pathname)
      ? new URL(pathe.dot + pathe.dot, scopeUrl)
      : new URL(pathe.dot, scopeUrl)

    // exit early if scopeUrl ends in "node_modules" path segment
    if (/node_modules[/\\]$/.test(scopeUrl.pathname)) break

    // return scopeUrl if `package.json` file exists in directory
    if (await isFile(new URL('package.json', scopeUrl), fs)) return scopeUrl
  }

  return null
}

export default lookupPackageScope
