/**
 * @file Interfaces - ModuleFormatMap
 * @module mlly/interfaces/ModuleFormatMap
 */

/**
 * Module format registry.
 */
interface ModuleFormatMap {
  builtin: 'builtin'
  commonjs: 'commonjs'
  cts: 'commonjs-typescript'
  json: 'json'
  module: 'module'
  mts: 'module-typescript'
  wasm: 'wasm'
}

export type { ModuleFormatMap as default }
