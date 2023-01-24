/**
 * @file Interfaces - PackageScope
 * @module mlly/interfaces/PackageScope
 */

import type { PackageJson } from '@flex-development/pkg-types'

/**
 * Object representing a package scope.
 *
 * @see {@linkcode PackageJson}
 */
interface PackageScope {
  /**
   * URL of directory containing `package.json` file.
   */
  dir: string

  /**
   * URL of `package.json` file.
   */
  pkg: string

  /**
   * `package.json` object.
   */
  pkgjson: PackageJson
}

export type { PackageScope as default }
