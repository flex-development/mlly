/**
 * @file Fixtures - fsa
 * @module fixtures/fsa
 */

import type { FileSystem } from '@flex-development/mlly'
import fs from 'node:fs'

/**
 * A file system API with asynchronous methods.
 *
 * @type {FileSystem}
 */
const fsa: FileSystem = {
  readFile: fs.promises.readFile,
  realpath: fs.promises.realpath,
  stat: fs.promises.stat
}

export default fsa
