/**
 * @file hasESMSyntax
 * @module mlly/utils/hasESMSyntax
 */

import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'

/**
 * Detects if `code` contains ESM syntax. Ignores matches in comments.
 *
 * Syntax patterns:
 *
 * - `export` (declaration, default, named, star)
 * - `import` (default, dynamic, named, star)
 * - `import.meta.(env|resolve|url)`
 *
 * @see https://regex101.com/r/xfreyy
 *
 * @param {string} code - Code to evaluate
 * @return {boolean} `true` if `code` contains esm syntax, `false` otherwise
 * @throws {NodeError<TypeError>} If `code` is not a string
 */
const hasESMSyntax = (code: string): boolean => {
  validateString(code, 'code')

  /**
   * ESM syntax regex.
   *
   * @see https://regex101.com/r/xfreyy
   *
   * @const {RegExp} ESM_SYNTAX_REGEX
   */
  const ESM_SYNTAX_REGEX: RegExp =
    /(?<!(?:\/\/|\*).*)((?:export|import)[\s\w*,{}]*(?=\sfrom)|export\b\s*(?:[*{]|async function|(?:abstract\s)?class|const|default|enum|function|interface|let|type|var)|await import|import\.meta\.(?:env(?:\.\w+)?|resolve|url))/gm

  return !!code.match(ESM_SYNTAX_REGEX)
}

export default hasESMSyntax
