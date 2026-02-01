/**
 * @file patternMatch
 * @module mlly/lib/patternMatch
 */

import chars from '#internal/chars'
import patternKeyCompare from '#lib/pattern-key-compare'
import type { PatternMatch } from '@flex-development/mlly'
import { ok } from 'devlop'

/**
 * Get a subpath pattern match for `matchKey`.
 *
 * @see {@linkcode PatternMatch}
 *
 * @this {void}
 *
 * @param {string} matchKey
 *  The key to expand
 * @param {unknown} matchObject
 *  The match keys object
 * @return {PatternMatch | null}
 *  List, where the first item is the key of a package exports
 *  or imports target object, and the last is a subpath pattern match
 */
function patternMatch(
  this: void,
  matchKey: string,
  matchObject: unknown
): PatternMatch | null {
  if (typeof matchObject === 'object' && matchObject) {
    if (
      Object.prototype.hasOwnProperty.call(matchObject, matchKey) &&
      !matchKey.includes(chars.asterisk)
    ) {
      return [matchKey, null]
    }

    /**
     * Keys of {@linkcode matchObject} containing only a single "*".
     *
     * Keys are sorted by {@linkcode patternKeyCompare}, which orders in
     * descending order of specificity.
     *
     * @const {string[]} expansionKeys
     */
    const expansionKeys: string[] = Object
      .getOwnPropertyNames(matchObject)
      .filter(expansionKey => {
        /**
         * Index of {@linkcode chars.asterisk} in {@linkcode expansionKey}.
         *
         * @const {number} patternIndex
         */
        const patternIndex: number = expansionKey.indexOf(chars.asterisk)

        return (
          patternIndex >= 0 &&
          patternIndex === expansionKey.lastIndexOf(chars.asterisk)
        )
      })
      .sort(patternKeyCompare)

    for (const expansionKey of expansionKeys) {
      /**
       * Index of {@linkcode chars.asterisk} in {@linkcode expansionKey}.
       *
       * @const {number} patternIndex
       */
      const patternIndex: number = expansionKey.indexOf(chars.asterisk)

      /**
       * Segment before {@linkcode chars.asterisk} in {@linkcode expansionKey}.
       *
       * @const {string} patternBase
       */
      const patternBase: string = expansionKey.slice(0, patternIndex)

      ok(patternIndex >= 0, 'expected `patternIndex >= 0`')

      if (matchKey !== patternBase && matchKey.startsWith(patternBase)) {
        /**
         * Segment after {@linkcode chars.asterisk} in {@linkcode expansionKey}.
         *
         * @const {string} patternTrailer
         */
        const patternTrailer: string = expansionKey.slice(patternIndex + 1)

        if (
          !patternTrailer.length ||
          (
            matchKey.endsWith(patternTrailer) &&
            (
              matchKey.length >= expansionKey.length ||
              matchKey === patternBase + patternTrailer
            )
          )
        ) {
          return [
            expansionKey,
            matchKey.slice(
              patternBase.length,
              matchKey.length - patternTrailer.length
            )
          ]
        }
      }
    }
  }

  return null
}

export default patternMatch
