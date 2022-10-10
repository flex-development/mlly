/**
 * @file Interfaces - ResolveAliasOptions
 * @module mlly/interfaces/ResolveAliasOptions
 */

import type { OneOrMany } from '@flex-development/tutils'

/**
 * Path alias resolution options.
 *
 * @see https://github.com/dividab/tsconfig-paths
 */
interface ResolveAliasOptions {
  /**
   * Base directory to resolve non-absolute module names.
   *
   * @see https://www.typescriptlang.org/tsconfig#baseUrl
   *
   * @default process.cwd()
   */
  baseUrl?: string

  /**
   * Module extensions to probe for.
   *
   * @default RESOLVE_EXTENSIONS
   */
  extensions?: string[] | readonly string[]

  /**
   * Checks for the existence of a file at `path`.
   *
   * @param {string} path - Path to check
   * @return {boolean} `true` if file exists, `false` otherwise
   */
  fileExists?(this: void, path: string): boolean

  /**
   * `package.json` fields to check when resolving modules.
   *
   * A nested field can be selected by passing an array of field names.
   *
   * @default ['main', 'module']
   */
  mainFields?: OneOrMany<string>[]

  /**
   * Absolute path to file containing path alias.
   */
  parent?: string

  /**
   * Path mappings.
   *
   * **Note**: Should be relative to {@link baseUrl}.
   *
   * @see https://www.typescriptlang.org/tsconfig#paths
   *
   * @default {}
   */
  paths?: Record<string, string[]>

  /**
   * Synchronously returns the contents of `filename`.
   *
   * @param {string} filename - Filename
   * @return {string} Contents of `filename`
   */
  readFile?(this: void, filename: string): string

  /**
   * Absolute path to tsconfig file.
   */
  tsconfig?: string
}

export type { ResolveAliasOptions as default }
