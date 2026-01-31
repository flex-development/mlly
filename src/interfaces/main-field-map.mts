/**
 * @file Interfaces - MainFieldMap
 * @module mlly/interfaces/MainFieldMap
 */

/**
 * Registry of main fields.
 *
 * This interface can be augmented to register custom main fields.
 *
 * @example
 *  declare module '@flex-development/mlly' {
 *    interface MainFieldMap {
 *      unpkg: 'unpkg'
 *    }
 *  }
 */
interface MainFieldMap {
  main: 'main'
  module: 'module'
  types: 'types'
}

export type { MainFieldMap as default }
