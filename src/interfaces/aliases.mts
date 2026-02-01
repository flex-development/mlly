/**
 * @file Interfaces - Aliases
 * @module mlly/interfaces/Aliases
 */

/**
 * Record, where each key is a path alias or pattern and each value
 * is a path mapping configuration.
 *
 * This interface can be augmented to register custom aliases.
 *
 * @example
 *  declare module '@flex-development/mlly' {
 *    interface Aliases {
 *      custom?: string[] | string | null
 *    }
 *  }
 */
interface Aliases {
  [alias: string]: (string | null | undefined)[] | string | null | undefined
}

export type { Aliases as default }
