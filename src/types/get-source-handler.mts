/**
 * @file Type Aliases - GetSourceHandler
 * @module mlly/types/GetSourceHandler
 */

import type { Awaitable, GetSourceContext } from '@flex-development/mlly'

/**
 * Get the source code for `url`.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode GetSourceContext}
 * @see {@linkcode URL}
 *
 * @this {GetSourceContext}
 *
 * @param {URL} url
 *  Module URL
 * @return {Awaitable<Uint8Array | string | null | undefined>}
 *  Source code
 */
type GetSourceHandler = (
  this: GetSourceContext,
  url: URL
) => Awaitable<Uint8Array | string | null | undefined>

export type { GetSourceHandler as default }
