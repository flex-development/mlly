/**
 * @file lookupPackageScope
 * @module mlly/utils/lookupPackageScope
 */

import type { PackageScope } from '#src/interfaces'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import type { Nullable } from '@flex-development/tutils'
import { URL, fileURLToPath } from 'node:url'
import readPackageJson from './read-package-json'

/**
 * Lookups a package scope for a given module `id`.
 *
 * @see {@linkcode PackageScope}
 *
 * @param {URL | string} id - Module id to get package scope for
 * @return {?PackageScope} Package scope result or `null` if `package.json` file
 * is not found
 */
const lookupPackageScope = (id: URL | string): Nullable<PackageScope> => {
  /**
   * Path to directory containing `package.json` file.
   *
   * @var {string} dir
   */
  let dir: string =
    id instanceof URL
      ? id.pathname
      : typeof id === 'string' && id.startsWith('file:')
      ? fileURLToPath(id)
      : id

  // search for package.json
  while (dir && dir !== pathe.sep && !dir.endsWith('node_modules')) {
    /**
     * Possible `package.json` object.
     *
     * @const {Nullable<PackageJson>} pkg
     */
    const pkg: Nullable<PackageJson> = readPackageJson(dir)

    if (pkg) return { dir: pathe.resolve(process.cwd(), dir), pkg }
    dir = pathe.dirname(dir)
  }

  return null
}

export default lookupPackageScope
