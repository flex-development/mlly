/**
 * @file readPackageJson
 * @module mlly/utils/readPackageJson
 */

import isFile from '#src/internal/is-file'
import validateString from '#src/internal/validate-string'
import validateURLString from '#src/internal/validate-url-string'
import type { ModuleId } from '#src/types'
import {
  ERR_INVALID_PACKAGE_CONFIG,
  type NodeError
} from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import { isEmptyString, isNIL, type Nullable } from '@flex-development/tutils'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import toURL from './to-url'

/**
 * Reads a `package.json` file from the given directory.
 *
 * Returns `null` if a file is not found.
 *
 * @see {@linkcode ModuleId}
 * @see {@linkcode PackageJson}
 *
 * @param {ModuleId} [dir='.'] - Id of directory containing `package.json` file
 * @param {string?} [specifier] - Module specifier passed by user to initiate
 * reading of `package.json` file
 * @param {ModuleId?} [parent] - Id of module to resolve from
 * @return {?PackageJson} `package.json` object or `null` if file is not found
 * @throws {NodeError<Error | TypeError>} If `dir` is not a string or instance
 * of {@linkcode URL}, if `specifier` is not a string, if `parent` is not a
 * string, or if a `package.json` is file found and does not contain valid JSON
 */
const readPackageJson = (
  dir: ModuleId = '.',
  specifier?: string,
  parent?: ModuleId
): Nullable<PackageJson> => {
  // ensure dir is an instance of URL or a string
  validateURLString(dir, 'dir')

  // ensure specifier is a string
  if (specifier !== undefined) validateString(specifier, 'specifier')

  // ensure parent is an instance of URL or a string
  if (parent !== undefined) validateURLString(parent, 'parent')

  // ensure dir is a path
  dir = fileURLToPath(toURL(dir))

  /**
   * Absolute path to `package.json` file.
   *
   * @const {string} path
   */
  const path: string = pathe.toNamespacedPath(pathe.join(dir, 'package.json'))

  // return null if package.json file does not exist
  if (!isFile(path)) return null

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
    let base: string | undefined

    // get base
    switch (true) {
      case specifier && !isNIL(parent) && !isEmptyString(parent):
        base = `'${specifier}' from ${fileURLToPath(toURL(parent!))}`
        break
      case specifier?.startsWith('file:'):
        base = fileURLToPath(specifier!)
        break
    }

    throw new ERR_INVALID_PACKAGE_CONFIG(path, base, (e as SyntaxError).message)
  }

  return pkg
}

export default readPackageJson
