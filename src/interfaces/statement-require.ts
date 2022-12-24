/**
 * @file Interfaces - RequireStatement
 * @module mlly/interfaces/RequireStatement
 */

import type { StatementKind } from '#src/enums'
import type { SyntaxKindRequire } from '#src/types'
import type Statement from './statement'

/**
 * Require statement object.
 *
 * @see {@linkcode Statement}
 * @see {@linkcode SyntaxKindRequire}
 *
 * @extends {Statement}
 */
interface RequireStatement extends Statement {
  /**
   * Import names.
   */
  imports: string[]

  /**
   * Statement kind.
   */
  kind: StatementKind.REQUIRE

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
  syntax: SyntaxKindRequire
}

export type { RequireStatement as default }
