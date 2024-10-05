/**
 * @file Interfaces - Aliases
 * @module mlly/interfaces/Aliases
 */

/**
 * Path aliases.
 */
interface Aliases {
  [alias: string]: (string | null | undefined)[] | string | null | undefined
}

export type { Aliases as default }
