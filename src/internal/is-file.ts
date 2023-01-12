/**
 * @file Internal - isFile
 * @module mlly/internal/isFile
 */

import fs from 'node:fs'
import type { URL } from 'node:url'

/**
 * Checks if a file exists at `id`.
 *
 * @param {URL | string} id - Module id to evaluate
 * @return {boolean} `true` if file exists at `id`
 */
const isFile = (id: URL | string): boolean => {
  try {
    return fs.statSync(id, { throwIfNoEntry: false })?.isFile() ?? false
  } catch {
    return false
  }
}

export default isFile
