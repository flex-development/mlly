/**
 * @file Interfaces - StaticImport
 * @module mlly/interfaces/StaticImport
 */

import type ImportStatement from './statement-import'

/**
 * Static import statement object schema.
 *
 * @see {@link ImportStatement}
 *
 * @extends {ImportStatement}
 */
interface StaticImport extends ImportStatement {
  /**
   * Import statement type.
   */
  type: 'default' | 'named' | 'star'
}

export type { StaticImport as default }
