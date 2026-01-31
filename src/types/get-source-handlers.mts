/**
 * @file Type Aliases - GetSourceHandlers
 * @module mlly/types/GetSourceHandlers
 */

import type { GetSourceHandler, Protocol } from '@flex-development/mlly'

/**
 * Record, where key is a URL protocol and each value is a source code handler.
 *
 * @see {@linkcode GetSourceHandler}
 * @see {@linkcode Protocol}
 */
type GetSourceHandlers = {
  [H in Protocol]?: GetSourceHandler | null | undefined
}

export type { GetSourceHandlers as default }
