/**
 * @file Type Definitions - SyntaxKindExport
 * @module mlly/types/SyntaxKindExport
 */

import type { StatementSyntaxKind } from '#src/enums'

/**
 * `export` statement syntax kinds.
 *
 * @see {@linkcode StatementSyntaxKind}
 */
type SyntaxKindExport =
  | StatementSyntaxKind.DECLARATION
  | StatementSyntaxKind.DEFAULT
  | StatementSyntaxKind.LIST
  | StatementSyntaxKind.NAMED
  | StatementSyntaxKind.NAMESPACE

export type { SyntaxKindExport as default }
