/**
 * @file Interfaces - IsDirectory
 * @module mlly/interfaces/IsDirectory
 */

/**
 * Check if a stats object describes a directory.
 */
interface IsDirectory {
  /**
   * @this {unknown}
   *
   * @return {boolean}
   *  `true` if stats describes directory, `false` otherwise
   */
  (): boolean
}

export type { IsDirectory as default }
