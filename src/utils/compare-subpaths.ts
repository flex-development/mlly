/**
 * @file compareSubpaths
 * @module mlly/utils/compareSubpaths
 */

import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'
import { CompareResult } from '@flex-development/tutils'

/**
 * Returns a number indicating if a subpath pattern is equal to, greater than,
 * or less than another subpath pattern.
 *
 * - `-1`: `subpath2` is less than `subpath1`
 * - `0`: `subpath2` is equal to `subpath1`
 * - `1`: `subpath2` is greater than `subpath1`
 *
 * Implements the `PATTERN_KEY_COMPARE` algorithm. Does not ensure either
 * subpath ends with `"/"` or contains only a single `"*"`, however.
 *
 * @see https://nodejs.org/api/esm.html#resolution-algorithm
 *
 * @param {string} subpath1 - Subpath to be compared
 * @param {string} subpath2 - Subpath to compare `subpath1` to
 * @return {CompareResult} Comparsion result
 * @throws {NodeError<TypeError>} If `subpath1` or `subpath2` is not a string
 */
const compareSubpaths = (subpath1: string, subpath2: string): CompareResult => {
  validateString(subpath1, 'subpath1')
  validateString(subpath2, 'subpath2')

  /**
   * Character representing a pattern.
   *
   * @const {string} pattern_char
   */
  const pattern_char: string = '*'

  /**
   * Index of {@linkcode pattern_char} in {@linkcode subpath1}.
   *
   * @const {number} pattern1
   */
  const pattern1: number = subpath1.indexOf(pattern_char)

  /**
   * Index of {@linkcode pattern_char} in {@linkcode subpath2}.
   *
   * @const {number} pattern2
   */
  const pattern2: number = subpath2.indexOf(pattern_char)

  /**
   * Base length of {@linkcode subpath1}.
   *
   * @const {number} length1
   */
  const length1: number = pattern1 === -1 ? subpath1.length : pattern1 + 1

  /**
   * Base length of {@linkcode subpath2}.
   *
   * @const {number} length2
   */
  const length2: number = pattern2 === -1 ? subpath2.length : pattern2 + 1

  return length1 > length2
    ? CompareResult.LESS_THAN
    : length2 > length1
    ? CompareResult.GREATER_THAN
    : pattern1 === -1
    ? CompareResult.GREATER_THAN
    : pattern2 === -1
    ? CompareResult.LESS_THAN
    : subpath1.length > subpath2.length
    ? CompareResult.LESS_THAN
    : subpath2.length > subpath1.length
    ? CompareResult.GREATER_THAN
    : CompareResult.EQUAL
}

export default compareSubpaths
