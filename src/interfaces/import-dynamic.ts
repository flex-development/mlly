/**
 * @file Interfaces - DynamicImport
 * @module mlly/interfaces/DynamicImport
 */

import type { StatementSyntaxKind } from '#src/enums'
import type { EmptyString, LiteralUnion } from '@flex-development/tutils'
import type ImportStatement from './statement-import'

/**
 * Dynamic import statement object.
 *
 * @see {@linkcode ImportStatement}
 * @see {@linkcode StatementSyntaxKind}
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import
 *
 * @extends {ImportStatement}
 */
interface DynamicImport extends ImportStatement {
  /**
   * Import expression.
   *
   * @example
   *  'import("foo.json")'
   * @example
   *  'import(foo)'
   */
  expression: LiteralUnion<EmptyString, string>

  /**
   * Options bag.
   *
   * @see https://github.com/tc39/proposal-import-assertions#dynamic-import
   *
   * @example
   *  '{ assert: { type: "json" } }'
   */
  options: LiteralUnion<EmptyString, string>

  /**
   * Statement syntax kind.
   */
  syntax: StatementSyntaxKind.DYNAMIC
}

export type { DynamicImport as default }
