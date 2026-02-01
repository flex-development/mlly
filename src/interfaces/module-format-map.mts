/**
 * @file Interfaces - ModuleFormatMap
 * @module mlly/interfaces/ModuleFormatMap
 */

/**
 * Registry of module formats.
 *
 * This interface can be augmented to register custom module formats.
 *
 * @example
 *  declare module '@flex-development/mlly' {
 *    interface ModuleFormatMap {
 *      custom: 'custom'
 *    }
 *  }
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
