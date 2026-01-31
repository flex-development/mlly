/**
 * @file Internal - identity
 * @module mlly/internal/identity
 */

/**
 * Return a constant value.
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
 * @return {T}
 *  `value`
 */
function identity<T>(this: void, value: T): T {
  return value
}

export default identity
