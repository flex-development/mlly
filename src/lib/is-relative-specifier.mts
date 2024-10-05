/**
 * @file isRelativeSpecifier
 * @module mlly/lib/isRelativeSpecifier
 */

import pathe from '@flex-development/pathe'

/**
 * Check if `specifier` is a *relative specifier*.
 *
 * ::: warning
 * Only checks specifier syntax. Does **not** guarantee the specifier references
 * a file that exists.
 * :::
 *
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @param {unknown} specifier
 *  Specifier to check
 * @return {boolean}
 *  `true` if `specifier` is relative specifier, `false` otherwise
 */
function isRelativeSpecifier(specifier: unknown): boolean {
  if (typeof specifier === 'string') {
    if (specifier[0] === pathe.dot) {
      if (specifier.length === 1 || specifier[1] === pathe.sep) return true

      if (
        specifier[1] === pathe.dot &&
        (specifier.length === 2 || specifier[2] === pathe.sep)
      ) {
        return true
      }
    }
  }

  return false
}

export default isRelativeSpecifier
