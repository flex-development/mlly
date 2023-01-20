/**
 * @file Internal - escapeRegExp
 * @module mlly/internal/escapeRegExp
 */

import type { NodeError } from '@flex-development/errnode'
import validateString from './validate-string'

/**
 * Escapes special characters in the given regex `pattern`.
 *
 * A backslash escape (`\\`) is used when valid. A `\x2d` escape is used when
 * the former would be disallowed by stricter Unicode pattern grammar.
 *
 * @param {string} pattern - Regex pattern to escape
 * @return {string} `pattern` with special characters escaped
 * @throws {NodeError<TypeError>} If `pattern` is not a string
 */
const escapeRegExp = (pattern: string): string => {
  validateString(pattern, 'pattern')
  return pattern.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&').replace(/-/g, '\\x2d')
}

export default escapeRegExp
