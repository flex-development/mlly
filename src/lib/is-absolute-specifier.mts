/**
 * @file isAbsoluteSpecifier
 * @module mlly/lib/isAbsoluteSpecifier
 */

import canParseUrl from '#lib/can-parse-url'
import isModuleId from '#lib/is-module-id'
import pathe from '@flex-development/pathe'

/**
 * Check if `value` is an *absolute specifier*.
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
 *  `true` if `value` is absolute specifier, `false` otherwise
 */
function isAbsoluteSpecifier(this: void, value: unknown): boolean {
  return (
    !isModuleId(value)
      ? false
      : typeof value === 'string'
      ? value.startsWith('file:')
        ? canParseUrl(value)
        : pathe.isAbsolute(value)
      : value.protocol === 'file:' && canParseUrl(value)
  )
}

export default isAbsoluteSpecifier
