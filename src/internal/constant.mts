/**
 * @file Internal - constant
 * @module mlly/internal/constant
 */

/**
 * Create a function that returns a constant value.
 *
 * @internal
 *
 * @template {unknown} T
 *  The value
 *
 * @this {void}
 *
 * @param {T} value
 *  The value
 * @return {(this: void) => T}
 *  `value`
 */
function constant<T>(this: void, value: T): (this: void) => T {
  return () => value
}

export default constant
