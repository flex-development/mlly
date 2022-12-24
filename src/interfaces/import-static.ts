/**
 * @file Interfaces - StaticImport
 * @module mlly/interfaces/StaticImport
 */

import type { SyntaxKind } from '#src/enums'
import type { SyntaxKindImport } from '#src/types'
import type { EmptyString, LiteralUnion } from '@flex-development/tutils'
import type ImportStatement from './statement-import'

/**
 * Static import statement object.
 *
 * @see {@linkcode ImportStatement}
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
  syntax: Extract<
    SyntaxKindImport,
    | SyntaxKind.DEFAULT
    | SyntaxKind.DEFAULT_WITH_NAMED
    | SyntaxKind.DEFAULT_WITH_NAMESPACE
    | SyntaxKind.NAMED
    | SyntaxKind.NAMESPACE
    | SyntaxKind.SIDE_EFFECT
  >

  /**
   * Type-only import statement check.
   */
  type: boolean
}

export type { StaticImport as default }
