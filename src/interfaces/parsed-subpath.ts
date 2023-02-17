/**
 * @file Interfaces - ParsedSubpath
 * @module mlly/interfaces/ParsedSubpath
 */

import type {
  EmptyString,
  LiteralUnion,
  Nullable
} from '@flex-development/tutils'

/**
 * Object representing a package subpath.
 *
 * @see https://nodejs.org/api/packages.html#subpath-exports
 * @see https://nodejs.org/api/packages.html#subpath-imports
 */
interface ParsedSubpath {
  /**
   * Subpath without entry prefix ({@linkcode key}).
   */
  base: LiteralUnion<EmptyString, string>

  /**
   * Subpath import check.
   *
   * @see https://nodejs.org/api/packages.html#imports
   * @see https://nodejs.org/api/packages.html#subpath-imports
   */
  internal: boolean

  /**
   * Subpath defined in `package.json` file.
   *
   * @see https://nodejs.org/api/packages.html#exports
   * @see https://nodejs.org/api/packages.html#imports
   */
  key: string

  /**
   * Subpath passed by user in module specifier.
   */
  raw: string

  /**
   * Module specifier passed by user.
   */
  specifier: string

  /**
   * Package target as documented in `package.json` file.
   */
  target: Nullable<string>
}

export type { ParsedSubpath as default }
