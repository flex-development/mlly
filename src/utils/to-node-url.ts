/**
 * @file toNodeURL
 * @module mlly/utils/toNodeURL
 */

import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'

/**
 * Converts the given module `specifier` to a `node:` URL.
 *
 * ::: warning
 * Does not guarantee the new specifier is an existing Node.js builtin module.
 * :::
 *
 * @see https://nodejs.org/api/esm.html#node-imports
 *
 * @param {string} specifier - Module specifier to convert
 * @return {string} `specifier` as `node:` URL
 * @throws {NodeError<TypeError>} If `specifier` is not a string
 */
const toNodeURL = (specifier: string): string => {
  validateString(specifier, 'specifier')
  return specifier.startsWith('node:') ? specifier : `node:${specifier}`
}

export default toNodeURL
