/**
 * @file isRelativeSpecifier
 * @module mlly/utils/isRelativeSpecifier
 */

import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'

/**
 * Checks if the given `specifier` is a relative specifier.
 *
 * ::: warning
 * Only checks specifier syntax. Does **not** guarantee the specifier references
 * a file that exists.
 * :::
 *
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @param {string} specifier - Specifier to evaluate
 * @return {boolean} `true` if `specifier` is relative specifier
 * @throws {NodeError<TypeError>} If `specifier` is not a string
 */
const isRelativeSpecifier = (specifier: string): boolean => {
  validateString(specifier, 'specifier')

  return specifier.startsWith('.')
    ? specifier.length === 1 || specifier[1] === pathe.sep
      ? true
      : specifier[1] === '.' &&
        (specifier.length === 2 || specifier[2] === pathe.sep)
    : false
}

export default isRelativeSpecifier
