/**
 * @file Internal - checkInvalidSegments
 * @module mlly/internal/checkInvalidSegments
 */

import chars from '#internal/chars'

/**
 * Check `str` for invalid path segments.
 *
 * @internal
 *
 * @param {string} str
 *  The package target or subpath pattern match to check
 * @return {boolean}
 *  `true` if `str` contains invalid path segments, `false` otherwise
 */
function checkInvalidSegments(str: string): boolean {
  /**
   * Regular expression matching path separators.
   *
   * @const {RegExp} separator
   */
  const separator: RegExp = /\/|\\/

  /**
   * Path segments.
   *
   * @const {string[]} segments
   */
  const segments: string[] = str.startsWith('./')
    ? str.slice(2).split(separator)
    : str.split(separator)

  /**
   * Regular expressions matching invalid segments.
   *
   * @const {RegExp[]} checks
   */
  const checks: RegExp[] = [
    /^(\.|%2e)(\.|%2e)?/i,
    /^(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53)/i
  ]

  for (const segment of segments) {
    if (segment === chars.empty || checks.some(check => check.test(segment))) {
      return true
    }
  }

  return false
}

export default checkInvalidSegments
