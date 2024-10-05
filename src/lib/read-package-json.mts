/**
 * @file readPackageJson
 * @module mlly/lib/readPackageJson
 */

import dfs from '#internal/fs'
import isFile from '#lib/is-file'
import {
  ERR_INVALID_PACKAGE_CONFIG,
  type ErrInvalidPackageConfig
} from '@flex-development/errnode'
import type { FileSystem, ModuleId } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'

/**
 * Read a `package.json` file.
 *
 * Implements the `READ_PACKAGE_JSON` algorithm.
 *
 * @see {@linkcode ErrInvalidPackageConfig}
 * @see {@linkcode FileSystem}
 * @see {@linkcode ModuleId}
 * @see {@linkcode PackageJson}
 *
 * @param {ModuleId} id
 *  URL of package directory, `package.json` file, or module in the same
 *  directory as a `package.json` file
 * @param {string | null | undefined} [specifier]
 *  Module specifier that initiated reading of `package.json` file.\
 *  Should be a `file:` URL if `parent` is a not a URL
 * @param {ModuleId | null | undefined} [parent]
 *  URL of parent module
 * @param {FileSystem | null | undefined} [fs]
 *  File system API
 * @return {PackageJson | null}
 *  Parsed file contents or `null`
 * @throws {ErrInvalidPackageConfig}
 *  If `package.json` file does not parse as valid JSON
 */
function readPackageJson(
  id: ModuleId,
  specifier?: string | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): PackageJson | null {
  /**
   * URL of `package.json` file.
   *
   * @const {URL} url
   */
  const url: URL = new URL('package.json', id)

  if (isFile(url, fs)) {
    /**
     * Stringified package config.
     *
     * @const {string} data
     */
    const data: string = String((fs ?? dfs).readFileSync(url))

    try {
      return JSON.parse(data) as PackageJson
    } catch (e: unknown) {
      /**
       * Error cause.
       *
       * @const {Error} cause
       */
      const cause: Error = e as Error

      /**
       * Invalid package config error.
       *
       * @const {ErrInvalidPackageConfig} error
       */
      const error: ErrInvalidPackageConfig = new ERR_INVALID_PACKAGE_CONFIG(
        url.pathname,
        parent && specifier
          ? `"${specifier}" from ${pathe.fileURLToPath(parent)}`
          : specifier && pathe.fileURLToPath(specifier),
        cause.message
      )

      error.cause = cause
      throw error
    }
  }

  return null
}

export default readPackageJson
