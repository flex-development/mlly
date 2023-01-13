/**
 * @file lookupPackageScope
 * @module mlly/utils/lookupPackageScope
 */

import type { PackageScope } from '#src/interfaces'
import type { ModuleId } from '#src/types'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import type { Nullable } from '@flex-development/tutils'
import readPackageJson from './read-package-json'
import toURL from './to-url'

/**
 * Lookups a package scope for a given module `id`.
 *
 * @see {@linkcode ModuleId}
 * @see {@linkcode PackageScope}
 *
 * @param {ModuleId} id - Module id to get package scope for
 * @param {ModuleId?} [base] - Base URL to resolve `id` against if `id` is not
 * absolute
 * @return {?PackageScope} Package scope result or `null` if `package.json` file
 * is not found
 */
const lookupPackageScope = (
  id: ModuleId,
  base?: ModuleId
): Nullable<PackageScope> => {
  /**
   * Path to directory containing `package.json` file.
   *
   * @var {string} dir
   */
  let dir: string = toURL(id, base).pathname

  // search for package.json
  while (dir && dir !== pathe.sep && !dir.endsWith('node_modules')) {
    /**
     * Possible `package.json` object.
     *
     * @const {Nullable<PackageJson>} pkgjson
     */
    const pkgjson: Nullable<PackageJson> = readPackageJson(dir)

    if (pkgjson) {
      dir = pathe.resolve(process.cwd(), dir)
      return { dir, pkg: pathe.join(dir, 'package.json'), pkgjson }
    }

    dir = pathe.dirname(dir)
  }

  return null
}

export default lookupPackageScope
