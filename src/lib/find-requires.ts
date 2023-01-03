/**
 * @file findRequires
 * @module mlly/lib/findRequires
 */

import { SpecifierKind, StatementKind, SyntaxKind } from '#src/enums'
import type { RequireStatement } from '#src/interfaces'
import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'

/**
 * Finds all `require` statements in `code`. Ignores matches in comments.
 *
 * @see {@linkcode RequireStatement}
 * @see https://regex101.com/r/uCqSYB
 * @see https://nodejs.org/api/modules.html#requireid
 *
 * @param {string} [code=''] - Code to evaluate
 * @return {RequireStatement[]} Require statement objects
 * @throws {NodeError<TypeError>} If `code` is not a string
 */
const findRequires = (code: string = ''): RequireStatement[] => {
  validateString(code, 'code')

  /**
   * `require` statement regex.
   *
   * @const {RegExp} REQUIRE_REGEX
   */
  const REQUIRE_REGEX: RegExp =
    /(?<=^|[\s;])\b(?:(?:const\s*|let\s*|var\s*)?(?<imports>(?:[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*)|(?:[\w\t\n\r "$'*,./:{}-]+?))?\s*=?\s*(?<kind>require)\((?<specifier>["']?[\S\t\n\r]+?["']?)\)(?=;?\n?))(?<!(?:\/\/|\*).*)/gu

  return [...code.matchAll(REQUIRE_REGEX)].map(match => {
    const { 0: code = '', index: start = 0, groups = {} } = match
    const { imports = '', specifier = '' } = groups

    return {
      code,
      end: start + code.length,
      imports:
        imports === ''
          ? []
          : imports
              .replace(/^{|}$/g, '')
              .split(',')
              .map(e => e.trim())
              .filter(e => e.length > 0),
      kind: StatementKind.REQUIRE,
      specifier: specifier.replace(/^["']|["']$/g, ''),
      specifier_kind: /^["']/g.test(specifier)
        ? SpecifierKind.STATIC
        : SpecifierKind.DYNAMIC,
      start,
      syntax: SyntaxKind.REQUIRE
    }
  })
}

export default findRequires
