/**
 * @file toDataURL
 * @module mlly/utils/toDataURL
 */

import validateString from '#src/internal/validate-string'
import type { MimeType } from '#src/types'
import type { NodeError } from '@flex-development/errnode'

/**
 * Converts `code` into a [`data:` URL][1] using `base64` encoding.
 *
 * ::: tip
 * `data:` URLs only resolve [bare specifiers][2] for builtin modules and
 * [absolute specifiers][2].
 *
 * Call [`await resolveModules(code)`][3] to ensure all specifiers are absolute
 * or bare.
 * :::
 *
 * [1]: https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * [2]: https://nodejs.org/api/esm.html#terminology
 * [3]: {@link ./resolve-modules.ts}
 *
 * @see {@linkcode MimeType}
 * @see https://nodejs.org/api/esm.html#esm_data_imports
 *
 * @param {string} code - Code to convert
 * @param {MimeType} [mime='text/javascript'] - MIME type
 * @return {string} `code` as `data:` URL
 * @throws {NodeError<TypeError>} If `code` or `mime` is not a string
 */
const toDataURL = (
  code: string,
  mime: MimeType = 'text/javascript'
): string => {
  validateString(code, 'code')
  validateString(mime, 'mime')
  return `data:${mime};base64,${Buffer.from(code).toString('base64')}`
}

export default toDataURL
