/**
 * @file isRelativeSpecifier
 * @module mlly/utils/isRelativeSpecifier
 */

import validateString from '#src/internal/validate-string'
import pathe from '@flex-development/pathe'
import { DOT, at } from '@flex-development/tutils'

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
 */
const isRelativeSpecifier = (specifier: string): boolean => {
  validateString(specifier, 'specifier')

  return specifier.startsWith(DOT)
    ? specifier.length === 1 || at(specifier, 1) === pathe.sep
      ? true
      : at(specifier, 1) === DOT &&
        (specifier.length === 2 || at(specifier, 2) === pathe.sep)
    : false
}

export default isRelativeSpecifier
