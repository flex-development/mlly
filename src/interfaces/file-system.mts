/**
 * @file Interfaces - FileSystem
 * @module mlly/interfaces/FileSystem
 */

import type { Awaitable, ModuleId, Stats } from '@flex-development/mlly'

/**
 * The file system API.
 */
interface FileSystem {
  /**
   * Read the entire contents of a file.
   *
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
  readFile(this: void, id: ModuleId): Awaitable<Buffer | string>

  /**
   * Compute a canonical pathname by resolving `.`, `..`, and symbolic links.
   *
   * > 👉 **Note**: A canonical pathname is not necessarily unique.
   * > Hard links and bind mounts can expose an entity through many pathnames.
   *
   * @see {@linkcode Awaitable}
   * @see {@linkcode ModuleId}
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  The module id
   * @return {Awaitable<string>}
   *  The canonical pathname
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
   *  The module id
   * @return {Awaitable<Stats>}
   *  The info
   */
  stat(this: void, id: ModuleId): Awaitable<Stats>
}

export type { FileSystem as default }
