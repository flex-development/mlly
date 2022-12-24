/**
 * @file Interfaces - Statement
 * @module mlly/interfaces/Statement
 */

import type { SpecifierKind, StatementKind, SyntaxKind } from '#src/enums'
import type { Nullable } from '@flex-development/tutils'

/**
 * CommonJS or ESM statement object.
 *
 * @see {@linkcode SpecifierKind}
 * @see {@linkcode StatementKind}
 * @see {@linkcode SyntaxKind}
 */
interface Statement {
  /**
   * Statement snippet.
   */
  code: string

  /**
   * End index of {@linkcode code} in source content.
   */
  end: number

  /**
   * Statement kind.
   */
  kind: StatementKind

  /**
   * Module specifier.
   */
  specifier: Nullable<string>

  /**
   * Module specifier kind.
   */
  specifier_kind: Nullable<SpecifierKind>

  /**
   * Statement syntax kind.
   */
  syntax: SyntaxKind

  /**
   * Start index of {@linkcode code} in source content.
   */
  start: number
}

export type { Statement as default }
