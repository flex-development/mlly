/**
 * @file Interfaces - Stats
 * @module mlly/interfaces/Stats
 */

import type { IsDirectory, IsFile } from '@flex-development/mlly'

/**
 * An object describing a directory or file.
 */
interface Stats {
  /**
   * Check if the stats object describes a directory.
   *
   * @see {@linkcode IsDirectory}
   */
  isDirectory: IsDirectory

  /**
   * Check if the stats object describes a file.
   *
   * @see {@linkcode IsFile}
   */
  isFile: IsFile
}

export type { Stats as default }
