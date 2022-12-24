/**
 * @file Interfaces - ExportStatement
 * @module mlly/interfaces/ExportStatement
 */

import type { StatementKind } from '#src/enums'
import type { Declaration, SyntaxKindExport } from '#src/types'
import type { Nullable } from '@flex-development/tutils'
import type Statement from './statement'

/**
 * Export statement object.
 *
 * @see {@linkcode Declaration}
 * @see {@linkcode Statement}
 * @see {@linkcode SyntaxKindExport}
 *
 * @extends {Statement}
 */
interface ExportStatement extends Statement {
  /**
   * Export declaration, if any.
   */
  declaration: Nullable<Declaration>

  /**
   * Export names.
   */
  exports: string[]

  /**
   * Statement kind.
   */
  kind: StatementKind.EXPORT

  /**
   * Modifier keywords.
   */
  modifiers: string[]

  /**
   * Statement syntax kind.
   */
  syntax: SyntaxKindExport

  /**
   * Type-only export statement check.
   */
  type: boolean
}

export type { ExportStatement as default }
