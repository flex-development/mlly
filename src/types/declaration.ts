/**
 * @file Type Definitions - Declaration
 * @module mlly/types/Declaration
 */

/**
 * Export declaration kinds.
 */
type Declaration =
  | 'class'
  | 'const enum'
  | 'const'
  | 'enum'
  | 'function'
  | 'function*'
  | 'interface'
  | 'let'
  | 'namespace'
  | 'type'
  | 'var'

export type { Declaration as default }
