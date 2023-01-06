/**
 * @file readPackageJson
 * @module mlly/utils/readPackageJson
 */

import validateString from '#src/internal/validate-string'
import {
  ERR_INVALID_ARG_TYPE,
  ERR_INVALID_PACKAGE_CONFIG,
  type NodeError
} from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import type { Nullable } from '@flex-development/tutils'
import fs from 'node:fs'
import { URL, fileURLToPath } from 'node:url'

/**
 * Reads a `package.json` file from the given directory.
 *
 * Returns `null` if a file is not found.
 *
 * @see {@linkcode NodeError}
 * @see {@linkcode PackageJson}
 *
 * @param {URL | string} [dir='.'] - Id of directory containing `package.json`
 * @param {string?} [specifier] - Module specifier passed by user to initiate
 * reading of `package.json` file
 * @param {string?} [parent] - Id of module `specifier` is relative to
 * @return {?PackageJson} `package.json` object or `null` if file is not found
 * @throws {NodeError<Error | TypeError>} If `dir` is not a string or instance
 * of {@linkcode URL}, if `specifier` is not a string, if `parent` is not a
 * string, or if a `package.json` is file found and does not contain valid JSON
 */
const readPackageJson = (
  dir: URL | string = '.',
  specifier?: string,
  parent?: string
): Nullable<PackageJson> => {
  // ensure is an instance of URL or a string
  if (!(dir instanceof URL) && typeof dir !== 'string') {
    throw new ERR_INVALID_ARG_TYPE('dir', ['URL', 'string'], dir)
  }

  // ensure specifier is a string
  if (specifier !== undefined) validateString(specifier, 'specifier')

  // ensure parent is a string
  if (parent !== undefined) validateString(parent, 'parent')

  // ensure dir is a path
  if (dir instanceof URL) dir = dir.pathname
  else if (dir.startsWith('file:')) dir = fileURLToPath(dir)

  /**
   * Full path to `package.json` file.
   *
   * @const {string} path
   */
  const path: string = pathe.toNamespacedPath(pathe.join(dir, 'package.json'))

  // return null if package.json file does not exist
  if (!fs.existsSync(path)) return null

  /**
   * Possible `package.json` object.
   *
   * @var {PackageJson} pkg
   */
  let pkg: PackageJson

  // try parsing package.json file
  try {
    pkg = JSON.parse(fs.readFileSync(path, 'utf8'))
  } catch (e: unknown) {
    /**
     * String containing module specifier passed by user to initiate reading of
     * `package.json` file and the location the module specifier was imported
     * from.
     *
     * @var {string | undefined} base
     */
    let base: string | undefined = specifier ? `'${specifier}'` : undefined

    // add specifier import location
    if (base && parent) base += ` from ${parent}`

    throw new ERR_INVALID_PACKAGE_CONFIG(path, base, (e as SyntaxError).message)
  }

  return pkg
}

export default readPackageJson
