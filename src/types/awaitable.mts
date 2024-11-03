/**
 * @file Type Aliases - Awaitable
 * @module mlly/types/Awaitable
 */

/**
 * Create a union of `T` and a `T` as a promise-like value.
 *
 * @see {@linkcode PromiseLike}
 *
 * @template {any} T
 *  Value
 */
type Awaitable<T> = PromiseLike<T> | T

export type { Awaitable as default }
