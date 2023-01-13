/**
 * @file Interfaces - PackageScope
 * @module mlly/interfaces/PackageScope
 */

import type { PackageJson } from '@flex-development/pkg-types'

/**
 * Object containing a `package.json` object and an absolute path to a directory
 * containing a `package.json` file.
 *
 * @see {@linkcode PackageJson}
 */
interface PackageScope {
  /**
   * Absolute path to directory containing `package.json` file.
   */
  dir: string

  /**
   * Absolute path to `package.json` file.
   */
  pkg: string

  /**
   * `package.json` object.
   */
  pkgjson: PackageJson
}

export type { PackageScope as default }
