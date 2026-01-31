/**
 * @file Interfaces - Aliases
 * @module mlly/interfaces/Aliases
 */

/**
 * Record, where each key is a path alias or pattern
 * and each value is a path mapping or a list of path mappings.
 */
interface Aliases {
  [alias: string]: (string | null | undefined)[] | string | null | undefined
}

export type { Aliases as default }
