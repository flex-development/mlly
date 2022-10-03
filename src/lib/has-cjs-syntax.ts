/**
 * @file hasCJSSyntax
 * @module mlly/lib/hasCJSSyntax
 */

import { CJS_SYNTAX_REGEX } from '#src/constants'

/**
 * Detects if `code` contains CommonJS syntax. Ignores matches in comments.
 *
 * Syntax patterns:
 *
 * - `__dirname`
 * - `__filename`
 * - `exports`
 * - `module.exports`
 * - `require`
 * - `require.*`
 *
 * @param {string} code - Code to check
 * @return {boolean} `true` if `code` contains cjs syntax, `false` otherwise
 */
const hasCJSSyntax = (code: string): boolean => !!code.match(CJS_SYNTAX_REGEX)

export default hasCJSSyntax
