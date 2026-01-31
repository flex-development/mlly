/**
 * @file Internal - fs/node
 * @module mlly/internal/fs/node
 */

import type { FileSystem } from '@flex-development/mlly'
import nfs from 'node:fs'

/**
 * The file system API.
 *
 * @const {FileSystem} fs
 */
const fs: FileSystem = {
  readFile: nfs.readFileSync,
  realpath: nfs.realpathSync,
  stat: nfs.statSync
}

export default fs
