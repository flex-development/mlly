/**
 * @file isAbsoluteSpecifier
 * @module mlly/utils/isAbsoluteSpecifier
 */

import pathe from '@flex-development/pathe'

/**
 * Checks if the given `specifier` is an absolute specifier.
 *
 * ::: warning
 * Only checks specifier syntax. Does **not** guarantee the specifier references
 * a file that exists.
 * :::
 *
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @param {string} specifier - Specifier to evaluate
 * @return {boolean} `true` if `specifier` is absolute specifier
 */
const isAbsoluteSpecifier = (specifier: string): boolean => {
  return pathe.isAbsolute(specifier) || specifier.startsWith('file:///')
}

export default isAbsoluteSpecifier
