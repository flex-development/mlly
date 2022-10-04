/**
 * @file Interfaces - DynamicImport
 * @module mlly/interfaces/DynamicImport
 */

import type ImportStatement from './statement-import'

/**
 * Dynamic import statement object schema.
 *
 * @see {@link ImportStatement}
 *
 * @extends {ImportStatement}
 */
interface DynamicImport extends ImportStatement {
  /**
   * {@link specifier} type.
   */
  specifier_type: 'dynamic' | 'static'

  /**
   * Import statement type.
   */
  type: 'dynamic'
}

export type { DynamicImport as default }
