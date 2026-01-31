/**
 * @file isImportsSubpath
 * @module mlly/lib/isImportsSubpath
 */

import chars from '#internal/chars'
import type { ImportsSubpath } from '@flex-development/pkg-types'

/**
 * Check if `value` is an `imports` subpath.
 *
 * @see {@linkcode ImportsSubpath}
 * @see https://nodejs.org/api/packages.html#subpath-imports
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to check
 * @return {value is ImportsSubpath}
 *  `true` if `value` is `imports` subpath, `false` otherwise
 */
function isImportsSubpath(
  this: void,
  value: unknown
): value is ImportsSubpath {
  return typeof value === 'string' && value[0] === chars.hash
}

export default isImportsSubpath
