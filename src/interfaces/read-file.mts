/**
 * @file Interfaces - ReadFile
 * @module mlly/interfaces/ReadFile
 */

import type { Awaitable, ModuleId } from '@flex-development/mlly'

/**
 * Read the entire contents of a file.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode Buffer}
 *
 * @template {Awaitable<Buffer | string>} [T]
 *  The file contents
 */
interface ReadFile<
  T extends Awaitable<Buffer | string> = Awaitable<Buffer | string>
> {
  /**
   * @see {@linkcode ModuleId}
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  The module id
   * @return {T}
   *  The file contents
   */
  (this: void, id: ModuleId): T
}

export type { ReadFile as default }
