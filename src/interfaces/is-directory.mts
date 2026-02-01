/**
 * @file Interfaces - IsDirectory
 * @module mlly/interfaces/IsDirectory
 */

/**
 * Check if a stats object describes a directory.
 */
interface IsDirectory {
  /**
   * @this {void}
   *
   * @return {boolean}
   *  `true` if stats describes directory, `false` otherwise
   */
  (this: void): boolean
}

export type { IsDirectory as default }
