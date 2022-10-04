/**
 * @file Interfaces - ImportStatement
 * @module mlly/interfaces/ImportStatement
 */

import type Statement from './statement'

/**
 * Import statement object schema.
 *
 * @see {@link Statement}
 *
 * @extends {Statement}
 */
interface ImportStatement extends Statement {
  /**
   * Import names.
   */
  imports: string[]

  /**
   * Module specifier.
   */
  specifier: NonNullable<Statement['specifier']>

  /**
   * Import statement type.
   */
  type: 'default' | 'dynamic' | 'named' | 'star'
}

export type { ImportStatement as default }
