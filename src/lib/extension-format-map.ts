/**
 * @file extensionFormatMap
 * @module mlly/lib/extensionFormatMap
 */

import formats from '#lib/formats'
import type { ModuleFormat } from '@flex-development/mlly'
import type { Ext } from '@flex-development/pathe'

/**
 * File extension to module format map.
 *
 * @see {@linkcode Ext}
 * @see {@linkcode ModuleFormat}
 *
 * @const {Map<Ext, ModuleFormat>} extensionFormatMap
 */
const extensionFormatMap: Map<Ext, ModuleFormat> = new Map<Ext, ModuleFormat>([
  ['.cjs', formats.commonjs],
  ['.cts', formats.cts],
  ['.d.cts', formats.cts],
  ['.d.mts', formats.mts],
  ['.d.ts', formats.mts],
  ['.js', formats.module],
  ['.json', formats.json],
  ['.jsx', formats.module],
  ['.mjs', formats.module],
  ['.mts', formats.mts],
  ['.node', formats.commonjs],
  ['.ts', formats.mts],
  ['.tsx', formats.mts],
  ['.wasm', formats.wasm]
])

export default extensionFormatMap
