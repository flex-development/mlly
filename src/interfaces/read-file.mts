/**
 * @file Interfaces - ReadFile
 * @module mlly/interfaces/ReadFile
 */

import type { Awaitable, ModuleId } from '@flex-development/mlly'

/**
 * Read the entire contents of a file.
 */
interface ReadFile {
  /**
   * @see {@linkcode Awaitable}
   * @see {@linkcode Buffer}
   * @see {@linkcode ModuleId}
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  The module id
   * @return {Awaitable<Buffer | string>}
   *  The file contents
   */
  (this: void, id: ModuleId): Awaitable<Buffer | string>
}

export type { ReadFile as default }
