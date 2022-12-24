/**
 * @file Interfaces - ImportStatement
 * @module mlly/interfaces/ImportStatement
 */

import type { StatementKind } from '#src/enums'
import type { SyntaxKindImport } from '#src/types'
import type Statement from './statement'

/**
 * Import statement object.
 *
 * @see {@linkcode Statement}
 * @see {@linkcode SyntaxKindImport}
 *
 * @extends {Statement}
 */
interface ImportStatement extends Statement {
  /**
   * Import names.
   */
  imports: string[]

  /**
   * Statement kind.
   */
  kind: StatementKind.IMPORT

  /**
   * Module specifier.
   */
  specifier: NonNullable<Statement['specifier']>

  /**
   * Module specifier kind.
   */
  specifier_kind: NonNullable<Statement['specifier_kind']>

  /**
   * Statement syntax kind.
   */
  syntax: SyntaxKindImport
}

export type { ImportStatement as default }
