/**
 * @file Internals - isArrayIndex
 * @module mlly/internal/isArrayIndex
 */

import type { Numeric } from '@flex-development/tutils'

/**
 * Checks if if the given `key` is a numeric property key as defined in ECMA-262
 * [6.1.7 Array Index][1].
 *
 * [1]: https://tc39.es/ecma262/#integer-index
 *
 * @param {string} key - Property key to evaluate
 * @return {key is Numeric} `true` if `key` is numeric property key
 */
const isArrayIndex = (key: string): key is Numeric => {
  /**
   * {@linkcode key} as number.
   *
   * @const {number} num
   */
  const num: number = +key

  return `${num}` !== key ? false : num >= 0 && num < 0xffff_ffff
}

export default isArrayIndex
