/**
 * @file Internal - isFunction
 * @module mlly/internal/isFunction
 */

/**
 * Checks if the given `value` is a function.
 *
 * @param {unknown} value - Value to check
 * @return {value is (...args: any[]) => any} `true` if `value` is a unction
 */
const isFunction = (value: unknown): value is (...args: any[]) => any => {
  return typeof value === 'function'
}

export default isFunction
