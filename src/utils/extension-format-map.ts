/**
 * @file EXTENSION_FORMAT_MAP
 * @module mlly/utils/EXTENSION_FORMAT_MAP
 */

import { Format } from '#src/enums'
import type { Ext } from '@flex-development/pathe'

/**
 * Default file extension to module formats map.
 *
 * @see {@linkcode Ext}
 * @see {@linkcode Format}
 *
 * @const {Map<Ext, Format>} EXTENSION_FORMAT_MAP
 */
const EXTENSION_FORMAT_MAP: Map<Ext, Format> = new Map<Ext, Format>([
  ['.cjs', Format.COMMONJS],
  ['.cts', Format.COMMONJS],
  ['.d.cts', Format.COMMONJS],
  ['.d.mts', Format.MODULE],
  ['.d.ts', Format.MODULE],
  ['.js', Format.MODULE],
  ['.json', Format.JSON],
  ['.jsx', Format.MODULE],
  ['.mjs', Format.MODULE],
  ['.mts', Format.MODULE],
  ['.node', Format.COMMONJS],
  ['.ts', Format.MODULE],
  ['.tsx', Format.MODULE],
  ['.wasm', Format.WASM]
])

export default EXTENSION_FORMAT_MAP
