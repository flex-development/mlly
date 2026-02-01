/**
 * @file Interfaces - PatternKeyComparisonMap
 * @module mlly/interfaces/PatternKeyComparisonMap
 */

/**
 * Registry of `PATTERN_KEY_COMPARE` algorithm results.
 *
 * This interface can be augmented to register custom results.
 *
 * @example
 *  declare module '@flex-development/mlly' {
 *    interface PatternKeyComparisonMap {
 *      afterThree: 3
 *    }
 *  }
 */
interface PatternKeyComparisonMap {
  /**
   * `a` should come after `b`.
   */
  after: 1

  /**
   * `a` should come before `b`.
   */
  before: -1

  /**
   * `a` and `b` are equal.
   */
  equal: 0
}

export type { PatternKeyComparisonMap as default }
