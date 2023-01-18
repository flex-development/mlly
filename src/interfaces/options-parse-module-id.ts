/**
 * @file Interfaces - ParseModuleIdOptions
 * @module mlly/interfaces/ParseModuleIdOptions
 */

import type { ModuleId } from '#src/types'

/**
 * Module id parsing options.
 *
 * @see {@linkcode ModuleId}
 */
interface ParseModuleIdOptions {
  /**
   * Indicate that the module id to be parsed should be a valid internal
   * specifier.
   *
   * @see https://nodejs.org/api/packages.html#subpath-exports
   *
   * @default false
   */
  internal?: boolean | undefined

  /**
   * URL of module to resolve from.
   *
   * **Note**: Used for error reporting only.
   *
   * @default undefined
   */
  parent?: ModuleId | undefined

  /**
   * Indicate that the module id to be parsed should begin with valid package
   * name.
   */
  pkgname?: boolean | undefined
}

export type { ParseModuleIdOptions as default }
