/**
 * @file Interfaces - ExportStatement
 * @module mlly/interfaces/ExportStatement
 */

import type { Declaration } from '#src/types'
import type Statement from './statement'

/**
 * Export statement object schema.
 *
 * @see {@linkcode Declaration}
 * @see {@linkcode Statement}
 *
 * @extends {Statement}
 */
interface ExportStatement extends Statement {
  /**
   * Export declaration, if any.
   */
  declaration: Declaration | undefined

  /**
   * Export names.
   */
  exports: string[]

  /**
   * Export statement type.
   */
  type: 'declaration' | 'default' | 'named' | 'star'
}

export type { ExportStatement as default }
