/**
 * @file hasCJSSyntax
 * @module mlly/lib/hasCJSSyntax
 */

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
 */
const hasCJSSyntax = (code: string): boolean => {
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
