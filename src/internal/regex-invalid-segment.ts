/**
 * @file Internal - invalidSegmentRegex
 * @module mlly/internal/invalidSegmentRegex
 */

/**
 * Returns a regular expression matching invalid path segments.
 *
 * @see https://github.com/nodejs/node/blob/v19.6.1/lib/internal/modules/esm/resolve.js#L299-L300
 *
 * @internal
 *
 * @param {'deprecated'?} type - Pattern type
 * @return {RegExp} Regular expression matching invalid path segments
 */
const invalidSegmentRegex = (type?: 'deprecated'): RegExp => {
  return new RegExp(
    `(^|\\\\|\\/)((\\.|%2e)(\\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))${
      type === 'deprecated' ? '' : '?'
    }(\\\\|\\/|$)`,
    'i'
  )
}

export default invalidSegmentRegex
