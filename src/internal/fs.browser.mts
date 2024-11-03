/**
 * @file Internal - fs/browser
 * @module mlly/internal/fs/browser
 */

import type { FileSystem } from '@flex-development/mlly'

/**
 * File system API.
 *
 * @const {FileSystem} fs
 */
const fs: FileSystem = {
  /**
   * Get the contents of a file.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  readFile(): never {
    throw new Error('[readFile] not implemented')
  },

  /**
   * Get the resolved pathname of a file.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  realpath(): never {
    throw new Error('[realpath] not implemented')
  },

  /**
   * Get information about a file.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  stat(): never {
    throw new Error('[stat] not implemented')
  }
}

export default fs
