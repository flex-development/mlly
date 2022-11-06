/**
 * @file hasESMSyntax
 * @module mlly/lib/hasESMSyntax
 */

import { ESM_SYNTAX_REGEX } from '#src/internal'

/**
 * Detects if `code` contains ESM syntax. Ignores matches in comments.
 *
 * Syntax patterns:
 *
 * - `export` (declaration, default, named, star)
 * - `import` (default, dynamic, named, star)
 * - `import.meta.(env|resolve|url)`
 *
 * @param {string} code - Code to check
 * @return {boolean} `true` if `code` contains esm syntax, `false` otherwise
 */
const hasESMSyntax = (code: string): boolean => !!code.match(ESM_SYNTAX_REGEX)

export default hasESMSyntax
