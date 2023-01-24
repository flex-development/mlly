/**
 * @file Internal - isDirectory
 * @module mlly/internal/isDirectory
 */

import type { ModuleId } from '#src/types'
import fs from 'node:fs'
import validateURLString from './validate-url-string'

/**
 * Checks if a directory exists at the given module `id`.
 *
 * @param {ModuleId} id - Module id to evaluate
 * @return {boolean} `true` if directory exists at `id`
 */
const isDirectory = (id: ModuleId): boolean => {
  try {
    validateURLString(id, 'id')
    return fs.statSync(id, { throwIfNoEntry: false })?.isDirectory() ?? false
  } catch {
    return false
  }
}

export default isDirectory
