/**
 * @file isAbsoluteSpecifier
 * @module mlly/lib/isAbsoluteSpecifier
 */

import canParseUrl from '#lib/can-parse-url'
import type { ModuleId } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

/**
 * Check if `specifier` is an *absolute specifier*.
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
 *  `true` if `specifier` is absolute specifier, `false` otherwise
 */
function isAbsoluteSpecifier(specifier: ModuleId): boolean {
  return typeof specifier === 'string'
    ? specifier.startsWith('file:')
      ? canParseUrl(specifier)
      : pathe.isAbsolute(specifier)
    : specifier.protocol === 'file:' && canParseUrl(specifier)
}

export default isAbsoluteSpecifier
