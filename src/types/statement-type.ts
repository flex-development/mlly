/**
 * @file Type Definitions - StatementType
 * @module mlly/types/StatementType
 */

/**
 * CommonJS and ESM statement types.
 */
type StatementType =
  | 'declaration'
  | 'default'
  | 'dynamic'
  | 'named'
  | 'require.resolve'
  | 'require'
  | 'star'

export type { StatementType as default }
