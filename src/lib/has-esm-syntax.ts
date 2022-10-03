/**
 * @file hasESMSyntax
 * @module mlly/lib/hasESMSyntax
 */

import { ESM_SYNTAX_REGEX } from '#src/constants'

/**
 * Detects if `code` contains ESM syntax. Ignores matches in comments.
 *
 * Syntax patterns:
 *
 * - `export` (declaration, default, named, star)
 * - `import` (default, dynamic, named, star)
 * - `import.meta.env`
 * - `import.meta.resolve`
 * - `import.meta.url`
 *
 * @param {string} code - Code to check
 * @return {boolean} `true` if `code` contains cjs syntax, `false` otherwise
 */
const hasESMSyntax = (code: string): boolean => !!code.match(ESM_SYNTAX_REGEX)

export default hasESMSyntax
