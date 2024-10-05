/**
 * @file isImportsSubpath
 * @module mlly/lib/isImportsSubpath
 */

import chars from '#internal/chars'
import type { ModuleId } from '@flex-development/mlly'
import type { ImportsSubpath } from '@flex-development/pkg-types'

/**
 * Check if `specifier` is an `imports` subpath.
 *
 * @see {@linkcode ModuleId}
 * @see https://nodejs.org/api/packages.html#subpath-imports
 *
 * @param {ModuleId} specifier
 *  Specifier to check
 * @return {specifier is ImportsSubpath}
 *  `true` if `specifier` is `imports` subpath, `false` otherwise
 */
function isImportsSubpath(specifier: ModuleId): specifier is ImportsSubpath {
  return typeof specifier === 'string' && specifier[0] === chars.hash
}

export default isImportsSubpath
