/**
 * @file Interfaces - IsFile
 * @module mlly/interfaces/IsFile
 */

/**
 * Check if a stats object describes a file.
 */
interface IsFile {
  /**
   * @this {void}
   *
   * @return {boolean}
   *  `true` if stats object describes regular file, `false` otherwise
   */
  (this: void): boolean
}

export type { IsFile as default }
