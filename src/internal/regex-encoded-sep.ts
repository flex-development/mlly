/**
 * @file Internal - ENCODED_SEP_REGEX
 * @module mlly/internal/ENCODED_SEP_REGEX
 */

/**
 * Regex pattern matching encoded path separators (e.g `/`, `\\`).
 *
 * @see https://regex101.com/r/XV7HzM
 *
 * @const {RegExp} ENCODED_SEP_REGEX
 */
const ENCODED_SEP_REGEX: RegExp = /%2f|%5c/i

export default ENCODED_SEP_REGEX
