/**
 * @file hasCJSSyntax
 * @module mlly/utils/hasCJSSyntax
 */

import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'

/**
 * Detects if `code` contains CommonJS syntax. Ignores matches in comments.
 *
 * Syntax patterns:
 *
 * - `__dirname`
 * - `__filename`
 * - `await import`
 * - `exports`
 * - `module.exports`
 * - `require`
 * - `require.*`
 *
 * @see https://regex101.com/r/Co77SJ
 *
 * @param {string} code - Code to evaluate
 * @return {boolean} `true` if `code` contains cjs syntax, `false` otherwise
 * @throws {NodeError<TypeError>} If `code` is not a string
 */
const hasCJSSyntax = (code: string): boolean => {
  validateString(code, 'code')

  /**
   * CommonJS syntax regex.
   *
   * @see https://regex101.com/r/Co77SJ
   *
   * @const {RegExp} CJS_SYNTAX_REGEX
   */
  const CJS_SYNTAX_REGEX: RegExp =
    /(?<!(?:\/\/|\*).*)((?:module\.)?exports(?:\.\w+|(?<!\s+=))|require(?=\(.)|require\.\w+|__dirname|__filename|await import)/gm

  return !!code.match(CJS_SYNTAX_REGEX)
}

export default hasCJSSyntax
