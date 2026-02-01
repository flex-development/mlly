/**
 * @file toUrl
 * @module mlly/lib/toUrl
 */

import canParseUrl from '#lib/can-parse-url'
import { isBuiltin } from '@flex-development/is-builtin'
import type { ModuleId } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

/**
 * Convert `id` to a {@linkcode URL}.
 *
 * > 👉 **Note**: If `id` cannot be parsed as a `URL`, and is also not a
 * > [builtin module][builtin-module], it will be assumed to be a path and
 * > converted to a [`file:` URL][file-url].
 *
 * [builtin-module]: https://nodejs.org/api/esm.html#builtin-modules
 * [file-url]: https://nodejs.org/api/esm.html#file-urls
 *
 * @this {void}
 *
 * @param {ModuleId} id
 *  The module id to convert
 * @param {ModuleId | null | undefined} [parent]
 *  The base URL to resolve against if `id` is not absolute
 * @return {URL}
 *  The new URL
 */
function toUrl(
  this: void,
  id: ModuleId,
  parent?: ModuleId | null | undefined
): URL {
  return canParseUrl(id, parent)
    ? new URL(id, parent ?? undefined)
    : isBuiltin(id)
    ? new URL('node:' + String(id))
    : pathe.pathToFileURL(String(id))
}

export default toUrl
