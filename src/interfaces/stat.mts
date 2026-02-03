/**
 * @file Interfaces - Stat
 * @module mlly/interfaces/Stat
 */

import type { Awaitable, ModuleId, Stats } from '@flex-development/mlly'

/**
 * Get information about a directory or file.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Stats}
 *
 * @template {Awaitable<Stats>} [T]
 *  The info
 */
interface Stat<T extends Awaitable<Stats> = Awaitable<Stats>> {
  /**
   * @see {@linkcode ModuleId}
   *
   * @this {unknown}
   *
   * @param {ModuleId} id
   *  The module id
   * @return {T}
   *  The info
   */
  (id: ModuleId): T
}

export type { Stat as default }
