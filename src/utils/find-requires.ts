/**
 * @file findRequires
 * @module mlly/utils/findRequires
 */

import {
  SpecifierSyntaxKind,
  StatementKind,
  StatementSyntaxKind
} from '#src/enums'
import type { RequireStatement } from '#src/interfaces'
import getSpecifierKind from '#src/internal/get-specifier-kind'
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
    /(?<=^|[\s:;[])\b(?:(?:const\s*|let\s*|var\s*)?(?:(?<=(?:const\s*|let\s*|var\s*))(?<imports>(?:[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*)|(?:[\w\t\n\r "$'*,./:{}-]+?)))?\s*=?\s*(?<kind>require)\((?<specifier>["']?[\S\t\n\r]+?["']?)\))(?<!(?:\/\/|\*).*)/gu

  return [...code.matchAll(REQUIRE_REGEX)].map(match => {
    const { 0: code = '', index: start = 0, groups = {} } = match
    const { imports = '', specifier = '' } = groups

    /**
     * Module specifier syntax.
     *
     * @const {SpecifierSyntaxKind} specifier_syntax
     */
    const specifier_syntax: SpecifierSyntaxKind = /^["']/.test(specifier)
      ? SpecifierSyntaxKind.STATIC
      : SpecifierSyntaxKind.DYNAMIC

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
      specifier_kind:
        specifier_syntax === SpecifierSyntaxKind.DYNAMIC
          ? null
          : getSpecifierKind(specifier),
      specifier_syntax,
      start,
      syntax: StatementSyntaxKind.REQUIRE
    }
  })
}

export default findRequires
