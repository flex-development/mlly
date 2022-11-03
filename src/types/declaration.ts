/**
 * @file Type Definitions - Declaration
 * @module mlly/types/Declaration
 */

/**
 * Export declaration kinds.
 */
type Declaration =
  | 'abstract class'
  | 'async function'
  | 'async function*'
  | 'class'
  | 'const enum'
  | 'const'
  | 'default async function'
  | 'default async function*'
  | 'default async'
  | 'default function'
  | 'default function*'
  | 'default'
  | 'enum'
  | 'function'
  | 'function*'
  | 'interface'
  | 'let'
  | 'namespace'
  | 'type'
  | 'var'

export type { Declaration as default }
