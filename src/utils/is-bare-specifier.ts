/**
 * @file isBareSpecifier
 * @module mlly/utils/isBareSpecifier
 */

import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'
import { trim } from '@flex-development/tutils'
import isAbsoluteSpecifier from './is-absolute-specifier'
import isRelativeSpecifier from './is-relative-specifier'

/**
 * Checks if the given `specifier` is a bare specifier.
 *
 * ::: warning
 * Only checks specifier syntax. Does **not** guarantee the specifier references
 * a file that exists.
 * :::
 *
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @param {string} specifier - Specifier to evaluate
 * @return {boolean} `true` if `specifier` is bare specifier
 * @throws {NodeError<TypeError>} If `specifier` is not a string
 */
const isBareSpecifier = (specifier: string): boolean => {
  validateString(specifier, 'specifier')

  return (
    !!trim(specifier).length &&
    !isAbsoluteSpecifier(specifier) &&
    !isRelativeSpecifier(specifier)
  )
}

export default isBareSpecifier
