/**
 * @file Interfaces - ParsedDataUrl
 * @module mlly/interfaces/ParsedDataUrl
 */

import type { MimeType, Protocol } from '#src/types'
import type { EmptyString, LiteralUnion } from '@flex-development/tutils'
import type { URL } from 'node:url'

/**
 * Object representing a [`data:` URL][1].
 *
 * [1]: https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs
 *
 * @see {@linkcode Protocol}
 * @see {@linkcode MimeType}
 * @see https://nodejs.org/api/esm.html#data-imports
 */
interface ParsedDataUrl {
  /**
   * [base64][1] encoding check.
   *
   * [1]: https://developer.mozilla.org/docs/Glossary/Base64
   */
  base64: boolean

  /**
   * Data portion of URL.
   *
   * If {@linkcode base64} is `true`, `data` is base64-encoded.
   */
  data: LiteralUnion<EmptyString, string>

  /**
   * Serialized `data:` URL.
   *
   * @see https://nodejs.org/api/url.html#urlhref
   */
  href: URL['href']

  /**
   * MIME type.
   *
   * @see https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types
   */
  mime: LiteralUnion<MimeType, string>

  /**
   * Path portion of URL.
   *
   * @see https://nodejs.org/api/url.html#urlpathname
   */
  pathname: URL['pathname']

  /**
   * Protocol portion of URL.
   *
   * @see https://nodejs.org/api/url.html#urlprotocol
   */
  protocol: Extract<Protocol, 'data:'>
}

export type { ParsedDataUrl as default }
