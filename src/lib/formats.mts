/**
 * @file formats
 * @module mlly/lib/formats
 */

import type { ModuleFormat } from '@flex-development/mlly'

/**
 * Default module formats.
 *
 * @see {@linkcode ModuleFormat}
 *
 * @enum {ModuleFormat}
 */
const enum formats {
  builtin = 'builtin',
  commonjs = 'commonjs',
  cts = 'commonjs-typescript',
  json = 'json',
  module = 'module',
  mts = 'module-typescript',
  wasm = 'wasm'
}

export default formats
