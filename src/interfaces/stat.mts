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
   * @this {void}
   *
   * @param {ModuleId} id
   *  The module id
   * @return {Awaitable<Stats>}
   *  The info
   */
  (this: void, id: ModuleId): Awaitable<Stats>
}

export type { Stat as default }
