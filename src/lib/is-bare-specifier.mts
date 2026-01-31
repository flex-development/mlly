/**
 * @file isBareSpecifier
 * @module mlly/lib/isBareSpecifier
 */

import isAbsoluteSpecifier from '#lib/is-absolute-specifier'
import isRelativeSpecifier from '#lib/is-relative-specifier'
import { isBuiltin } from '@flex-development/is-builtin'

/**
 * Check if `value` is a *bare specifier*.
 *
 * ::: warning
 * Only checks specifier syntax. Does **not** guarantee the specifier references
 * a file that exists.
 * :::
 *
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to check
 * @return {boolean}
 *  `true` if `value` is bare specifier, `false` otherwise
 */
function isBareSpecifier(this: void, value: unknown): boolean {
  if (isBuiltin(value)) return true

  return (
    typeof value === 'string' &&
    !!value.length &&
    !isAbsoluteSpecifier(value) &&
    !isRelativeSpecifier(value)
  )
}

export default isBareSpecifier
