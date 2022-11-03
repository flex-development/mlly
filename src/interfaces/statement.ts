/**
 * @file Interfaces - Statement
 * @module mlly/interfaces/Statement
 */

import type { StatementType } from '#src/types'

/**
 * CommonJS or ESM statement object schema.
 *
 * @see {@link StatementType}
 */
interface Statement {
  /**
   * Statement snippet.
   */
  code: string

  /**
   * Ending index of {@link code} in source content.
   */
  end: number

  /**
   * Module specifier.
   */
  specifier: string | undefined

  /**
   * Starting index of {@link code} in source content.
   */
  start: number

  /**
   * Statement type.
   */
  type: StatementType
}

export type { Statement as default }
