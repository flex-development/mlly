/**
 * @file Type Definitions - SyntaxKindExport
 * @module mlly/types/SyntaxKindExport
 */

import type { SyntaxKind } from '#src/enums'

/**
 * `export` statement syntax kinds.
 *
 * @see {@linkcode SyntaxKind}
 */
type SyntaxKindExport =
  | SyntaxKind.DECLARATION
  | SyntaxKind.DEFAULT
  | SyntaxKind.LIST
  | SyntaxKind.NAMED
  | SyntaxKind.NAMESPACE

export type { SyntaxKindExport as default }
