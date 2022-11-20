/**
 * @file Interfaces - Statement
 * @module mlly/interfaces/Statement
 */

import type { StatementType } from '#src/types'

/**
 * CommonJS or ESM statement object schema.
 *
 * @see {@linkcode StatementType}
 */
interface Statement {
  /**
   * Statement snippet.
   */
  code: string

  /**
   * Ending index of {@linkcode code} in source content.
   */
  end: number

  /**
   * Module specifier.
   */
  specifier: string | undefined

  /**
   * Starting index of {@linkcode code} in source content.
   */
  start: number

  /**
   * Statement type.
   */
  type: StatementType
}

export type { Statement as default }
