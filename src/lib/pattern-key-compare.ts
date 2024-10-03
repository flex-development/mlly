/**
 * @file patternKeyCompare
 * @module mlly/lib/patternKeyCompare
 */

import chars from '#internal/chars'
import type { PatternKeyCompareResult } from '@flex-development/mlly'
import { ok } from 'devlop'

/**
 * Compares two strings that may contain a wildcard character (`'*'`) and
 * returns a value indicating their order:
 *
 * - `-1`: `a` should come before `b`
 * - `0`: `a` and `b` are equal
 * - `1`: `a` should come after `b`
 *
 * Implements the `PATTERN_KEY_COMPARE` algorithm.
 *
 * @see {@linkcode PatternKeyCompareResult}
 *
 * @param {string} a
 *  First string to compare
 * @param {string} b
 *  Second string to compare
 * @return {PatternKeyCompareResult}
 *  Comparsion result
 */
function patternKeyCompare(a: string, b: string): PatternKeyCompareResult {
  /**
   * Index of pattern character in {@linkcode a}.
   *
   * @var {number} aPatternIndex
   */
  let aPatternIndex: number = a.indexOf(chars.asterisk)

  /**
   * Index of pattern character in {@linkcode b}.
   *
   * @var {number} bPatternIndex
   */
  let bPatternIndex: number = b.indexOf(chars.asterisk)

  ok(aPatternIndex === a.lastIndexOf(chars.asterisk), 'expected a single "*"')
  ok(bPatternIndex === b.lastIndexOf(chars.asterisk), 'expected a single "*"')

  /**
   * Base length of {@linkcode a}.
   *
   * @const {number} baseLenA
   */
  const baseLenA: number = aPatternIndex === patternKeyCompare.LESS_THAN
    ? a.length
    : aPatternIndex + 1

  /**
   * Base length of {@linkcode b}.
   *
   * @const {number} baseLenB
   */
  const baseLenB: number = bPatternIndex === patternKeyCompare.LESS_THAN
    ? b.length
    : bPatternIndex + 1

  return baseLenA > baseLenB
    ? patternKeyCompare.LESS_THAN
    : baseLenB > baseLenA
    ? patternKeyCompare.GREATER_THAN
    : aPatternIndex === -1
    ? patternKeyCompare.GREATER_THAN
    : bPatternIndex === -1
    ? patternKeyCompare.LESS_THAN
    : a.length > b.length
    ? patternKeyCompare.LESS_THAN
    : b.length > a.length
    ? patternKeyCompare.GREATER_THAN
    : patternKeyCompare.EQUAL
}

patternKeyCompare.EQUAL = 0 as const
patternKeyCompare.GREATER_THAN = 1 as const
patternKeyCompare.LESS_THAN = -1 as const

export default patternKeyCompare
