/**
 * @file Type Aliases - GetSourceHandlers
 * @module mlly/types/GetSourceHandlers
 */

import type { GetSourceHandler, Protocol } from '@flex-development/mlly'

/**
 * Map where key is a URL protocol, and each value is `null`, `undefined`, or a
 * source code handler.
 *
 * @see {@linkcode GetSourceHandler}
 * @see {@linkcode Protocol}
 */
type GetSourceHandlers = Partial<Record<
  Protocol,
  GetSourceHandler | null | undefined
>>

export type { GetSourceHandlers as default }
