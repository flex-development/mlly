/**
 * @file isRelativeSpecifier
 * @module mlly/lib/isRelativeSpecifier
 */

import pathe from '@flex-development/pathe'

/**
 * Check if `value` is a *relative specifier*.
 *
 * ::: warning
 * Only checks specifier syntax.
 * Does **not** guarantee the specifier references an existing module.
 * :::
 *
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to check
 * @return {boolean}
 *  `true` if `value` is relative specifier, `false` otherwise
 */
function isRelativeSpecifier(this: void, value: unknown): boolean {
  if (typeof value === 'string') {
    if (value[0] === pathe.dot) {
      if (value.length === 1 || value[1] === pathe.sep) return true

      if (
        value[1] === pathe.dot &&
        (value.length === 2 || value[2] === pathe.sep)
      ) {
        return true
      }
    }
  }

  return false
}

export default isRelativeSpecifier
