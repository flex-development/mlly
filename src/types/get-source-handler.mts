/**
 * @file Type Aliases - GetSourceHandler
 * @module mlly/types/GetSourceHandler
 */

import type {
  Awaitable,
  FileContent,
  GetSourceContext
} from '@flex-development/mlly'

/**
 * Get the source code for a module.
 *
 * @see {@linkcode Awaitable}
 * @see {@linkcode FileContent}
 * @see {@linkcode GetSourceContext}
 * @see {@linkcode URL}
 *
 * @this {GetSourceContext}
 *  The retrieval context
 *
 * @param {URL} url
 *  The module URL
 * @return {Awaitable<FileContent | null | undefined>}
 *  The source code
 */
type GetSourceHandler = (
  this: GetSourceContext,
  url: URL
) => Awaitable<FileContent | null | undefined>

export type { GetSourceHandler as default }
