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
   * Ensure module id is a valid internal specifier, syntactically.
   *
   * @see https://nodejs.org/api/packages.html#subpath-imports
   *
   * @default id instanceof URL ? false : id.startsWith('#')
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
   * Ensure module id begins with a valid package name.
   */
  pkgname?: boolean | undefined
}

export type { ParseModuleIdOptions as default }
