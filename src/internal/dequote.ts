/**
 * @file Internal - dequote
 * @module mlly/internal/dequote
 */

import { trim } from '@flex-development/tutils'

/**
 * Removes quotes from the beginning and end of a string.
 *
 * @internal
 *
 * @param {string} str - String to dequote
 * @return {string} String with quotes removed
 */
const dequote = (str: string): string => trim(str).replace(/^["']|["']$/g, '')

export default dequote
