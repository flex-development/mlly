/**
 * @file Constants
 * @module mlly/constants
 */

import type { Ext } from '@flex-development/pathe'

/**
 * Default export conditions.
 *
 * @see https://nodejs.org/api/packages.html#conditional-exports
 *
 * @const {Readonly<Set<string>>} CONDITIONS
 */
export const CONDITIONS: Readonly<Set<string>> = Object.freeze(
  new Set(['node', 'import'])
)

/**
 * Default resolvable file extensions.
 *
 * @see {@linkcode Ext}
 *
 * @const {ReadonlyArray<Ext>} RESOLVE_EXTENSIONS
 */
export const RESOLVE_EXTENSIONS: readonly Ext[] = Object.freeze([
  '.mjs',
  '.mts',
  '.cjs',
  '.cts',
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.css',
  '.json',
  '.node',
  '.wasm',
  '.d.mts',
  '.d.cts',
  '.d.ts'
])
