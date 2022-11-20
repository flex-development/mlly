/**
 * @file Interfaces - DynamicImport
 * @module mlly/interfaces/DynamicImport
 */

import type ImportStatement from './statement-import'

/**
 * Dynamic import statement object schema.
 *
 * @see {@linkcode ImportStatement}
 *
 * @extends {ImportStatement}
 */
interface DynamicImport extends ImportStatement {
  /**
   * Module specifier type.
   */
  specifier_type: 'dynamic' | 'static'

  /**
   * Import statement type.
   */
  type: 'dynamic'
}

export type { DynamicImport as default }
