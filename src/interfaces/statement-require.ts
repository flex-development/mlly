/**
 * @file Interfaces - RequireStatement
 * @module mlly/interfaces/RequireStatement
 */

import type Statement from './statement'

/**
 * Require statement object schema.
 *
 * @see {@linkcode Statement}
 *
 * @extends {Statement}
 */
interface RequireStatement extends Statement {
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
  type: 'require'
}

export type { RequireStatement as default }
