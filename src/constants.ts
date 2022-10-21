/**
 * @file Constants
 * @module mlly/constants
 */

import type { Ext } from './types'

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
 * @const {ReadonlyArray<Ext>} RESOLVE_EXTENSIONS
 */
export const RESOLVE_EXTENSIONS: readonly Ext[] = Object.freeze([
  '.cjs',
  '.css',
  '.cts',
  '.js',
  '.json',
  '.jsx',
  '.mjs',
  '.mts',
  '.node',
  '.ts',
  '.tsx',
  '.wasm',
  '.d.ts',
  '.d.mts',
  '.d.cts'
])
