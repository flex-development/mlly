/**
 * @file isBareSpecifier
 * @module mlly/lib/isBareSpecifier
 */

import isAbsoluteSpecifier from '#lib/is-absolute-specifier'
import isRelativeSpecifier from '#lib/is-relative-specifier'
import { isBuiltin } from '@flex-development/is-builtin'
import type { ModuleId } from '@flex-development/mlly'

/**
 * Check if `specifier` is a *bare specifier*.
 *
 * ::: warning
 * Only checks specifier syntax. Does **not** guarantee the specifier references
 * a file that exists.
 * :::
 *
 * @see {@linkcode ModuleId}
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @param {ModuleId} specifier
 *  Specifier to check
 * @return {boolean}
 *  `true` if `specifier` is bare specifier, `false` otherwise
 */
function isBareSpecifier(specifier: ModuleId): boolean {
  if (isBuiltin(specifier)) return true

  return (
    typeof specifier === 'string' &&
    !!specifier.length &&
    !isAbsoluteSpecifier(specifier) &&
    !isRelativeSpecifier(specifier)
  )
}

export default isBareSpecifier
