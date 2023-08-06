/**
 * @file Internal - getSpecifierKind
 * @module mlly/internal/getSpecifierKind
 */

import { SpecifierKind } from '#src/enums'
import isAbsoluteSpecifier from '#src/utils/is-absolute-specifier'
import isRelativeSpecifier from '#src/utils/is-relative-specifier'
import type { NodeError } from '@flex-development/errnode'
import { trim, type Nullable } from '@flex-development/tutils'
import validateString from './validate-string'

/**
 * Determines a specifier type for the given module `specifier`.
 *
 * @see {@linkcode SpecifierKind}
 *
 * @internal
 *
 * @param {string} specifier - Module specifier to evaluate
 * @return {Nullable<SpecifierKind>} Module `specifier` type or `null`
 * @throws {NodeError<TypeError>} If `specifier` is not a string
 */
const getSpecifierKind = (specifier: string): Nullable<SpecifierKind> => {
  validateString(specifier, 'specifier')

  // trim specifier and remove quotes (quotes could lead to a specifier being
  // classified as 'bare' when it is actually absolute or relative)
  specifier = trim(specifier).replace(/^["']|["']$/g, '')

  return specifier
    ? isAbsoluteSpecifier(specifier)
      ? SpecifierKind.ABSOLUTE
      : isRelativeSpecifier(specifier)
      ? SpecifierKind.RELATIVE
      : SpecifierKind.BARE
    : null
}

export default getSpecifierKind
