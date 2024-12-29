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
  readFileSync(): never {
    throw new Error('[readFileSync] not implemented')
  },

  /**
   * Get the resolved pathname of a file.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  realpathSync(): never {
    throw new Error('[realpathSync] not implemented')
  },

  /**
   * Get information about a file.
   *
   * @return {never}
   *  Never; not implemented
   * @throws {Error}
   */
  statSync(): never {
    throw new Error('[statSync] not implemented')
  }
}

export default fs
