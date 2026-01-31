/**
 * @file Type Aliases - Awaitable
 * @module mlly/types/Awaitable
 */

/**
 * Create a union of `T` and `T` as a promise-like object.
 *
 * @template {any} T
 *  The value
 */
type Awaitable<T> = PromiseLike<T> | T

export type { Awaitable as default }
