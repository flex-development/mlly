/**
 * @file Interfaces - StaticImport
 * @module mlly/interfaces/StaticImport
 */

import type { StatementSyntaxKind } from '#src/enums'
import type { EmptyString, LiteralUnion } from '@flex-development/tutils'
import type ImportStatement from './statement-import'

/**
 * Static import statement object.
 *
 * @see {@linkcode ImportStatement}
 * @see {@linkcode StatementSyntaxKind}
 *
 * @extends {ImportStatement}
 */
interface StaticImport extends ImportStatement {
  /**
   * Assertion options.
   *
   * @see https://github.com/tc39/proposal-import-assertions#import-statements
   *
   * @example
   *  '{ type: "json" }'
   */
  assertion: LiteralUnion<EmptyString, string>

  /**
   * Statement syntax kind.
   */
  syntax:
    | StatementSyntaxKind.DEFAULT
    | StatementSyntaxKind.DEFAULT_WITH_NAMED
    | StatementSyntaxKind.DEFAULT_WITH_NAMESPACE
    | StatementSyntaxKind.NAMED
    | StatementSyntaxKind.NAMESPACE
    | StatementSyntaxKind.SIDE_EFFECT

  /**
   * Type-only import statement check.
   */
  type: boolean
}

export type { StaticImport as default }
