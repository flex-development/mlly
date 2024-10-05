/**
 * @file Test Utilities - percentEncode
 * @module tests/utils/percentEncode
 */

import chars from '#internal/chars'

/**
 * Percent encode `str`.
 *
 * @param {string} str
 *  String to percent-encode
 * @return {string}
 *  Percent encoded string
 */
function percentEncode(str: string): string {
  return [...new TextEncoder().encode(str)]
    .map(i => '%' + i.toString(16).padStart(2, '0'))
    .join(chars.empty)
}

export default percentEncode
