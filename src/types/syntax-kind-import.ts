/**
 * @file Type Definitions - SyntaxKindImport
 * @module mlly/types/SyntaxKindImport
 */

import type { StatementSyntaxKind } from '#src/enums'

/**
 * `import` statement syntax kinds.
 *
 * @see {@linkcode StatementSyntaxKind}
 */
type SyntaxKindImport =
  | StatementSyntaxKind.DEFAULT
  | StatementSyntaxKind.DEFAULT_WITH_NAMED
  | StatementSyntaxKind.DEFAULT_WITH_NAMESPACE
  | StatementSyntaxKind.DYNAMIC
  | StatementSyntaxKind.NAMED
  | StatementSyntaxKind.NAMESPACE
  | StatementSyntaxKind.SIDE_EFFECT

export type { SyntaxKindImport as default }
