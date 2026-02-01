/**
 * @file defaultExtensions
 * @module mlly/lib/defaultExtensions
 */

import type { Ext } from '@flex-development/mlly'

/**
 * The default list of resolvable file extensions.
 *
 * @see {@linkcode Ext}
 *
 * @const {Set<Ext>} defaultExtensions
 */
const defaultExtensions: Set<Ext> = new Set([
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

export default defaultExtensions
