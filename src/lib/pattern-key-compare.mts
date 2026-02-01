/**
 * @file patternKeyCompare
 * @module mlly/lib/patternKeyCompare
 */

import chars from '#internal/chars'
import type { PatternKeyComparison } from '@flex-development/mlly'
import { ok } from 'devlop'

/**
 * Compare two pattern keys and return a value indicating their order.
 *
 * Implements the `PATTERN_KEY_COMPARE` algorithm.
 *
 * @see {@linkcode PatternKeyComparison}
 *
 * @this {void}
 *
 * @param {string} a
 *  The first key
 * @param {string} b
 *  The key to compare against `a`
 * @return {PatternKeyComparison}
 *  The pattern key comparsion result
 */
function patternKeyCompare(
  this: void,
  a: string,
  b: string
): PatternKeyComparison {
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
