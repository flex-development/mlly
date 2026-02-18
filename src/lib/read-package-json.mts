/**
 * @file readPackageJson
 * @module mlly/lib/readPackageJson
 */

import dfs from '#internal/fs'
import canParseUrl from '#lib/can-parse-url'
import isFile from '#lib/is-file'
import isModuleId from '#lib/is-module-id'
import {
  ERR_INVALID_PACKAGE_CONFIG,
  type ErrInvalidPackageConfig
} from '@flex-development/errnode'
import type {
  Awaitable,
  EmptyString,
  FileSystem,
  ModuleId
} from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import when from '@flex-development/when'

export default readPackageJson

/**
 * Read a `package.json` file.
 *
 * @see {@linkcode EmptyString}
 *
 * @this {void}
 *
 * @param {EmptyString | null | undefined} id
 *  The URL of the package directory, the `package.json` file,
 *  or a module in the same directory as a `package.json`
 * @param {string | null | undefined} [specifier]
 *  The module specifier that initiated the reading of the `package.json` file
 *  > 👉 **Note**: Should be a `file:` URL if `parent` is not a URL
 * @param {ModuleId | null | undefined} [parent]
 *  The URL of the parent module
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {null}
 *  The parsed file contents
 */
function readPackageJson(
  this: void,
  id: EmptyString | null | undefined,
  specifier?: string | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): null

/**
 * Read a `package.json` file.
 *
 * Implements the `READ_PACKAGE_JSON` algorithm.
 *
 * > 👉 **Note**: Returns a promise if `fs.readFile` or `fs.stat` is async.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode ErrInvalidPackageConfig}
 * @see {@linkcode FileSystem}
 * @see {@linkcode ModuleId}
 * @see {@linkcode PackageJson}
 *
 * @template {Awaitable<PackageJson | null>} T
 *  The parsed file contents
 *
 * @this {void}
 *
 * @param {ModuleId | null | undefined} id
 *  The URL of the package directory, the `package.json` file,
 *  or a module in the same directory as a `package.json`
 * @param {string | null | undefined} [specifier]
 *  The module specifier that initiated the reading of the `package.json` file
 *  > 👉 **Note**: Should be a `file:` URL if `parent` is not a URL
 * @param {ModuleId | null | undefined} [parent]
 *  The URL of the parent module
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {T}
 *  The parsed file contents
 * @throws {ErrInvalidPackageConfig}
 *  If `package.json` file does not parse as valid JSON
 *  or package manifest object is not a JSON object
 */
function readPackageJson<T extends Awaitable<PackageJson | null>>(
  this: void,
  id: ModuleId | null | undefined,
  specifier?: string | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): T

/**
 * Read a `package.json` file.
 *
 * Implements the `READ_PACKAGE_JSON` algorithm.
 *
 * > 👉 **Note**: Returns a promise if `fs.readFile` or `fs.stat` is async.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode ErrInvalidPackageConfig}
 * @see {@linkcode FileSystem}
 * @see {@linkcode ModuleId}
 * @see {@linkcode PackageJson}
 *
 * @this {void}
 *
 * @param {ModuleId | null | undefined} id
 *  The URL of the package directory, the `package.json` file,
 *  or a module in the same directory as a `package.json`
 * @param {string | null | undefined} [specifier]
 *  The module specifier that initiated the reading of the `package.json` file
 *  > 👉 **Note**: Should be a `file:` URL if `parent` is not a URL
 * @param {ModuleId | null | undefined} [parent]
 *  The URL of the parent module
 * @param {FileSystem | null | undefined} [fs]
 *  The file system API
 * @return {Awaitable<PackageJson | null>}
 *  The parsed file contents
 * @throws {ErrInvalidPackageConfig}
 *  If `package.json` file does not parse as valid JSON
 *  or package manifest object is not a JSON object
 */
function readPackageJson(
  this: void,
  id: ModuleId | null | undefined,
  specifier?: string | null | undefined,
  parent?: ModuleId | null | undefined,
  fs?: FileSystem | null | undefined
): Awaitable<PackageJson | null> {
  if (isModuleId(id) && canParseUrl(id)) {
    /**
     * The URL of the `package.json` file.
     *
     * @const {URL} url
     */
    const url: URL = new URL('package.json', id)

    // read package manifest.
    return when(isFile(url, fs ??= dfs), exists => {
      if (!exists) return null

      // parse file content.
      return when(fs!.readFile(url, 'utf8'), contents => {
        try {
          /**
           * The parsed file contents.
           *
           * @const {unknown} parsed
           */
          const parsed: unknown = JSON.parse(contents)

          if (isPackageJson(parsed)) return parsed
          throw new Error('Invalid package manifest object', { cause: parsed })
        } catch (e: unknown) {
          /**
           * The cause of the error.
           *
           * @const {Error} cause
           */
          const cause: Error = e as Error

          /**
           * The invalid package config error.
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
      })
    })
  }

  return null
}

/**
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is PackageJson}
 *  `true` if `value` looks like package manifest, `false` otherwise
 */
function isPackageJson(this: void, value: unknown): value is PackageJson {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
