/**
 * @file Interfaces - Stat
 * @module mlly/interfaces/Stat
 */

import type { Awaitable, ModuleId, Stats } from '@flex-development/mlly'

/**
 * Get information about a directory or file.
 */
interface Stat {
  /**
   * @see {@linkcode Awaitable}
   * @see {@linkcode ModuleId}
   * @see {@linkcode Stats}
   *
   * @template {Awaitable<Stats>} T
   *  The info
   *
   * @this {unknown}
   *
   * @param {ModuleId} id
   *  The module id
   * @return {T}
   *  The info
   */
  <T extends Awaitable<Stats>>(id: ModuleId): T
}

export type { Stat as default }
