/**
 * @file Internal - chainOrCall
 * @module mlly/internal/chainOrCall
 */

import isPromise from '#internal/is-promise'
import type { Awaitable } from '@flex-development/mlly'

export default chainOrCall

/**
 * Chain function parameters.
 *
 * @internal
 *
 * @template {any} R
 *  The previous resolved value
 * @template {any[]} P
 *  The function parameters
 */
type ChainParams<R, P extends any[]> = [...P, R?]

/**
 * Chain a callback, calling the function after `promise` is resolved,
 * otherwise synchronously call `fn`.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode ChainParams}
 *
 * @internal
 *
 * @template {any} T
 *  The resolved value of `fn`
 * @template {any} [R=unknown]
 *  The previous resolved value
 * @template {any[]} [P=any[]]
 *  The function parameters
 * @template {any} [Self=unknown]
 *  The `this` context of `fn`
 *
 * @this {void}
 *
 * @param {Awaitable<R>} promise
 *  The promise to chain or the resolved value
 * @param {(this: Self, ...params: ChainParams<R, P>) => Awaitable<T>} fn
 *  The function to call
 * @param {(e: unknown) => Awaitable<T>} [reject]
 *  The callback to fire when a promise is rejected
 * @param {Self | null | undefined} [self]
 *  The `this` context of `fn`
 * @param {P} params
 *  The arguments to pass to `fn`
 * @return {Awaitable<T>}
 *  A new promise to resolve or the result of `fn`
 */
function chainOrCall<
  T = unknown,
  R = unknown,
  P extends any[] = any[],
  Self = unknown
>(
  this: void,
  promise: Awaitable<R>,
  fn: (this: Self, ...params: ChainParams<R, P>) => Awaitable<T>,
  reject?: (e: unknown) => Awaitable<T>,
  self?: Self | null | undefined,
  ...params: P
): Awaitable<T>

/**
 * Chain a callback, calling the function after `promise` is resolved,
 * otherwise synchronously call `fn`.
 *
 * @internal
 *
 * @see {@linkcode Awaitable}
 *
 * @this {void}
 *
 * @param {unknown} promise
 *  The promise to chain or the resolved value
 * @param {(...params: any[]) => unknown} fn
 *  The function to call
 * @param {(e: unknown) => unknown} [reject]
 *  The callback to fire when a promise is rejected
 * @param {unknown} [self]
 *  The `this` context of `fn`
 * @param {unknown[]} params
 *  The arguments to pass to `fn`
 * @return {unknown}
 *  A new promise to resolve or the result of `fn`
 */
function chainOrCall(
  this: void,
  promise: unknown,
  fn: (...params: any[]) => unknown,
  reject?: (e: unknown) => unknown,
  self?: unknown,
  ...params: unknown[]
): unknown {
  return isPromise(promise) // already have a promise, chain callback.
    ? promise.then(resolved => fn.call(self, ...params, resolved), reject)
    : fn.call(self, ...params)
}
