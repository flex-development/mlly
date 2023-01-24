/**
 * @file lookupPackageScope
 * @module mlly/utils/lookupPackageScope
 */

import type { PackageScope } from '#src/interfaces'
import validateURLString from '#src/internal/validate-url-string'
import type { ModuleId } from '#src/types'
import type { NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import type { Nullable } from '@flex-development/tutils'
import { pathToFileURL } from 'node:url'
import readPackageJson from './read-package-json'
import toURL from './to-url'

/**
 * Finds a `package.json` file for the given module `id`. Ends the search at the
 * given end point **after** checking for a `package.json` file.
 *
 * Returns `null` if a `package.json` file is not found.
 *
 * @see {@linkcode ModuleId}
 * @see {@linkcode PackageScope}
 *
 * @param {ModuleId} id - Id of module to get package scope for
 * @param {ModuleId} [stopdir=pathe.sep] - Directory to end search
 * @return {?PackageScope} Package scope result or `null`
 * @throws {NodeError<TypeError>} If either `id` or `stopdir` is not an instance
 * of {@linkcode URL} or a string
 */
const lookupPackageScope = (
  id: ModuleId,
  stopdir: ModuleId = pathe.sep
): Nullable<PackageScope> => {
  validateURLString(id, 'id')
  validateURLString(stopdir, 'stopdir')

  /**
   * Path to directory containing `package.json` file.
   *
   * @var {string} dir
   */
  let dir: string = toURL(id).pathname

  // ensure stop point is pathname
  stopdir = toURL(stopdir).pathname

  /**
   * Package scope result.
   *
   * @var {Nullable<PackageScope>} scope
   */
  let scope: Nullable<PackageScope> = null

  // search for package.json
  while (dir && !dir.endsWith('node_modules')) {
    // stop search if outside of stop directory
    if (pathe.relative(stopdir, dir).startsWith('../')) break

    /**
     * Possible `package.json` object.
     *
     * @const {Nullable<PackageJson>} pkgjson
     */
    const pkgjson: Nullable<PackageJson> = readPackageJson(dir)

    // stop search if package.json has been found
    if (pkgjson) {
      scope = {
        dir: pathToFileURL((dir = pathe.resolve(process.cwd(), dir))).href,
        pkg: pathToFileURL(pathe.join(dir, 'package.json')).href,
        pkgjson
      }

      break
    }

    // stop search if stop directory has been reached
    if (dir === stopdir.replace(/\/$/, '')) break

    // continue searching for package.json
    dir = pathe.dirname(dir)
  }

  return scope
}

export default lookupPackageScope
