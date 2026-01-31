/**
 * @file Type Aliases - GetSourceHandler
 * @module mlly/types/GetSourceHandler
 */

import type { Awaitable, GetSourceContext } from '@flex-development/mlly'

/**
 * Get the source code for a module.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode GetSourceContext}
 * @see {@linkcode URL}
 *
 * @this {GetSourceContext}
 *  The retrieval context
 *
 * @param {URL} url
 *  The module URL
 * @return {Awaitable<Uint8Array | string | null | undefined>}
 *  The source code
 */
type GetSourceHandler = (
  this: GetSourceContext,
  url: URL
) => Awaitable<Uint8Array | string | null | undefined>

export type { GetSourceHandler as default }
