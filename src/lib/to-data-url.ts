/**
 * @file toDataURL
 * @module mlly/lib/toDataURL
 */

import type { MIMEType } from '#src/types'

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
 * @see {@linkcode MIMEType}
 * @see https://nodejs.org/api/esm.html#esm_data_imports
 *
 * @param {string} code - Code to convert
 * @param {MIMEType} [mime='text/javascript'] - MIME type
 * @return {string} `code` as `data:` URL
 */
const toDataURL = (
  code: string,
  mime: MIMEType = 'text/javascript'
): string => {
  return `data:${mime};base64,${Buffer.from(code).toString('base64')}`
}

export default toDataURL
