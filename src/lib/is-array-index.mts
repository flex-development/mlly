/**
 * @file isArrayIndex
 * @module mlly/lib/isArrayIndex
 */

import type { Numeric } from '@flex-development/mlly'

/**
 * Check if `value` is a valid array index.
 *
 * @see {@linkcode Numeric}
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to check
 * @return {value is Numeric}
 *  `true` if `value` is valid array index, `false` otherwise
 */
function isArrayIndex(this: void, value: unknown): value is Numeric {
  if (typeof value !== 'string') return false

  /**
   * The {@linkcode value} as number.
   *
   * @const {number} num
   */
  const num: number = +value

  return value === `${num}` && num >= 0 && num < 0xFFFF_FFFF
}

export default isArrayIndex
