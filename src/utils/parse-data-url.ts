/**
 * @file parseDataURL
 * @module mlly/utils/parseDataURL
 */

import type { ParsedDataUrl } from '#src/interfaces'
import {
  ERR_INVALID_URL,
  type ErrInvalidUrl,
  type NodeError
} from '@flex-development/errnode'
import type { Nullable } from '@flex-development/tutils'
import type { URL } from 'node:url'
import toURL from './to-url'

/**
 * Parses a [`data:` URL][1].
 *
 * If valid, returns an object representing the given `url`.
 *
 * **Note**: A [MIME type][2] string is required.
 *
 * [1]: https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs
 * [2]: https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types
 *
 * @see https://nodejs.org/api/esm.html#data-imports
 *
 * @param {URL | string} url - URL to evaluate
 * @return {ParsedDataUrl} Object representing `url`
 * @throws {ErrInvalidUrl | NodeError<TypeError>} If `url` is not a string or
 * instance of {@linkcode URL}, or if `url` not a valid `data:` URL
 */
const parseDataURL = (url: URL | string): ParsedDataUrl => {
  // ensure url is an instance of URL
  url = toURL(url)

  /**
   * Regex to extract `data:` URL components.
   *
   * @see https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs
   * @see https://regex101.com/r/Ie8Doq
   *
   * @const {RegExp} regex
   */
  const regex: RegExp =
    /^(?<protocol>data:)(?<mime>[^/]+\/[^,;]+)[^,]*?(?:;(?<base64>base64))?,(?<data>[\S\s]*?)$/

  /**
   * `data:` URL match.
   *
   * @const {Nullable<RegExpExecArray>} match
   */
  const match: Nullable<RegExpExecArray> = regex.exec(url.href)

  // throw if url is not data url
  if (!match) throw new ERR_INVALID_URL(url.href)

  // get data url components
  const [, , mime = '', base64, data = ''] = match

  return {
    base64: !!base64,
    data: data.trim(),
    href: url.href,
    mime,
    pathname: url.pathname,
    protocol: url.protocol as ParsedDataUrl['protocol']
  }
}

export default parseDataURL
