/**
 * @file Interfaces - FileSystem
 * @module mlly/interfaces/FileSystem
 */

import type { ModuleId, Stats } from '@flex-development/mlly'

/**
 * File system API.
 */
interface FileSystem {
  /**
   * Get the contents of `id`.
   *
   * @see {@linkcode ModuleId}
   * @see https://nodejs.org/api/fs.html#fsreadfilepath-options-callback
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  The path or `file:` URL to handle
   * @return {Buffer | string}
   *  File contents
   */
  readFileSync(this: void, id: ModuleId): Buffer | string

  /**
   * Get the resolved pathname for `id`.
   *
   * @see {@linkcode ModuleId}
   * @see https://nodejs.org/api/fs.html#fsrealpathpath-options-callback
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  The path or `file:` URL to handle
   * @return {string}
   *  Resolved pathname
   */
  realpathSync(this: void, id: ModuleId): string

  /**
   * Get information about a directory or file.
   *
   * @see {@linkcode ModuleId}
   * @see {@linkcode Stats}
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  The path or `file:` URL to handle
   * @return {Stats}
   *  Info about `id`
   */
  statSync(this: void, id: ModuleId): Stats
}

export type { FileSystem as default }
