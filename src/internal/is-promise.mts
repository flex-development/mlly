/**
 * @file Internal - isPromise
 * @module mlly/internal/isPromise
 */

/**
 * Check if `value` is a {@linkcode PromiseLike} object.
 *
 * @internal
 *
 * @template {any} T
 *  The resolved value of the promise
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The thing to check
 * @return {value is PromiseLike<T>}
 *  `true` if `value` is {@linkcode PromiseLike}, `false` otherwise
 */
function isPromise<T>(this: void, value: unknown): value is PromiseLike<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof value.then === 'function'
  )
}

export default isPromise
