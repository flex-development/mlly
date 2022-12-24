/**
 * @file Type Definitions - SyntaxKindImport
 * @module mlly/types/SyntaxKindImport
 */

import type { SyntaxKind } from '#src/enums'

/**
 * `import` statement syntax kinds.
 *
 * @see {@linkcode SyntaxKind}
 */
type SyntaxKindImport =
  | SyntaxKind.DEFAULT
  | SyntaxKind.DEFAULT_WITH_NAMED
  | SyntaxKind.DEFAULT_WITH_NAMESPACE
  | SyntaxKind.DYNAMIC
  | SyntaxKind.NAMED
  | SyntaxKind.NAMESPACE
  | SyntaxKind.SIDE_EFFECT

export type { SyntaxKindImport as default }
