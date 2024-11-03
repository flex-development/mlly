/**
 * @file Interfaces - FileSystem
 * @module mlly/interfaces/FileSystem
 */

import type { Awaitable, ModuleId, Stats } from '@flex-development/mlly'

/**
 * File system API.
 */
interface FileSystem {
  /**
   * Get the contents of `id`.
   *
   * @see {@linkcode Awaitable}
   * @see {@linkcode Buffer}
   * @see {@linkcode ModuleId}
   * @see https://nodejs.org/api/fs.html#fsreadfilepath-options-callback
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  The path or `file:` URL to handle
   * @return {Awaitable<Buffer | string>}
   *  File contents
   */
  readFile(this: void, id: ModuleId): Awaitable<Buffer | string>

  /**
   * Get the resolved pathname for `id`.
   *
   * @see {@linkcode Awaitable}
   * @see {@linkcode ModuleId}
   * @see https://nodejs.org/api/fs.html#fsrealpathpath-options-callback
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  The path or `file:` URL to handle
   * @return {Awaitable<string>}
   *  Resolved pathname
   */
  realpath(this: void, id: ModuleId): Awaitable<string>

  /**
   * Get information about a directory or file.
   *
   * @see {@linkcode Awaitable}
   * @see {@linkcode ModuleId}
   * @see {@linkcode Stats}
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  The path or `file:` URL to handle
   * @return {Awaitable<Stats>}
   *  Info about `id`
   */
  stat(this: void, id: ModuleId): Awaitable<Stats>
}

export type { FileSystem as default }
