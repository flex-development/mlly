/**
 * @file Interfaces - FileSystem
 * @module mlly/interfaces/FileSystem
 */

import type { ReadFile, Realpath, Stat } from '@flex-development/mlly'

/**
 * The file system API.
 */
interface FileSystem {
  /**
   * Read the entire contents of a file.
   *
   * @see {@linkcode ReadFile}
   */
  readFile: ReadFile

  /**
   * Compute a canonical pathname by resolving `.`, `..`, and symbolic links.
   *
   * @see {@linkcode Realpath}
   */
  realpath: Realpath

  /**
   * Get information about a directory or file.
   *
   * @see {@linkcode Stat}
   */
  stat: Stat
}

export type { FileSystem as default }
