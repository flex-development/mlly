/**
 * @file Utilities - isFile
 * @module mlly/utils/isFile
 */

import validateURLString from '#src/internal/validate-url-string'
import type { ModuleId } from '#src/types'
import { isString } from '@flex-development/tutils'
import fs from 'node:fs'
import toURL from './to-url'

/**
 * Checks if a file exists at the given module `id`.
 *
 * @param {ModuleId} id - Module id to evaluate
 * @return {boolean} `true` if file exists at `id`
 */
const isFile = (id: ModuleId): boolean => {
  try {
    validateURLString(id, 'id')
    if (isString(id) && id.startsWith('file:///')) id = toURL(id)
    return fs.statSync(id, { throwIfNoEntry: false })?.isFile() ?? false
  } catch {
    return false
  }
}

export default isFile
