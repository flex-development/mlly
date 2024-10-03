/**
 * @file Interfaces - Stats
 * @module mlly/interfaces/Stats
 */

/**
 * File system metadata.
 */
interface Stats {
  /**
   * Check if the stats object describes a file system directory.
   *
   * @this {void}
   *
   * @return {boolean}
   *  `true` if stats object describes directory, `false` otherwise
   */
  isDirectory(this: void): boolean

  /**
   * Check if the stats object describes a regular file.
   *
   * @this {void}
   *
   * @return {boolean}
   *  `true` if stats object describes regular file, `false` otherwise
   */
  isFile(this: void): boolean
}

export type { Stats as default }
