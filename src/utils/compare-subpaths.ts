/**
 * @file compareSubpaths
 * @module mlly/utils/compareSubpaths
 */

import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'
import { CompareResult } from '@flex-development/tutils'
import assert from 'node:assert'

/**
 * Returns a number indicating if a subpath pattern is equal to, greater than,
 * or less than another subpath pattern.
 *
 * - `-1`: `subpath2` is less than `subpath1`
 * - `0`: `subpath2` is equal to `subpath1`
 * - `1`: `subpath2` is greater than `subpath1`
 *
 * Implements the `PATTERN_KEY_COMPARE` algorithm.
 *
 * @see https://nodejs.org/api/esm.html#resolution-algorithm
 *
 * @param {string} subpath1 - Subpath to be compared
 * @param {string} subpath2 - Subpath to compare `subpath1` to
 * @return {CompareResult} Comparsion result
 * @throws {NodeError<Error | TypeError>} If either either subpath contains more
 * than pattern character (`'*'`) or is not a string
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
  let pattern1: number = -1

  /**
   * Index of {@linkcode pattern_char} in {@linkcode subpath2}.
   *
   * @const {number} pattern2
   */
  let pattern2: number = -1

  // ensure subpaths contain a single '*'
  for (const [index, subpath] of [subpath1, subpath2].entries()) {
    /**
     * Error message thrown if {@linkcode subpath} contains more than one `'*'`.
     *
     * @const {string} message
     */
    const message: string = `'${subpath}' is expected to contain a single '*'`

    /**
     * Index of {@linkcode pattern_char} in {@linkcode subpath}.
     *
     * @const {number} pattern
     */
    const pattern_index: number = subpath.indexOf(pattern_char)

    // ensure respective subpath contains no more than one '*'
    assert(pattern_index === subpath.lastIndexOf(pattern_char), message)

    // set index of pattern character in respective subpath
    index === 0 ? (pattern1 = pattern_index) : (pattern2 = pattern_index)
  }

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
