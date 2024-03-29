/**
 * @file isAbsoluteSpecifier
 * @module mlly/utils/isAbsoluteSpecifier
 */

import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import { URL } from 'node:url'

/**
 * Checks if the given `specifier` is an absolute specifier.
 *
 * ::: warning
 * Only checks specifier syntax. Does **not** guarantee the specifier references
 * a file that exists.
 * :::
 *
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @param {string} specifier - Specifier to evaluate
 * @return {boolean} `true` if `specifier` is absolute specifier
 * @throws {NodeError<TypeError>} If `specifier` is not a string
 */
const isAbsoluteSpecifier = (specifier: string): boolean => {
  validateString(specifier, 'specifier')

  /**
   * Absolute specifier check.
   *
   * @var {string} absolute
   */
  let absolute: boolean = false

  // check if specifier is absolute path or valid file url
  switch (true) {
    case pathe.isAbsolute(specifier):
      absolute = true
      break
    case specifier.startsWith('file:'):
      try {
        new URL(specifier)
        absolute = true
      } /* c8 ignore next */ catch {}
      break
    default:
      absolute = false
  }

  return absolute
}

export default isAbsoluteSpecifier
