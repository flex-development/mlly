/**
 * @file RESOLVE_EXTENSIONS
 * @module mlly/utils/RESOLVE_EXTENSIONS
 */

import type { Ext } from '@flex-development/pathe'

/**
 * Default resolvable file extensions.
 *
 * @see {@linkcode Ext}
 *
 * @const {ReadonlyArray<Ext>} RESOLVE_EXTENSIONS
 */
const RESOLVE_EXTENSIONS: readonly Ext[] = Object.freeze([
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

export default RESOLVE_EXTENSIONS
