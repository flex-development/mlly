/**
 * @file findStaticImports
 * @module mlly/utils/findStaticImports
 */

import {
  SpecifierSyntaxKind,
  StatementKind,
  StatementSyntaxKind
} from '#src/enums'
import type { StaticImport } from '#src/interfaces'
import getSpecifierKind from '#src/internal/get-specifier-kind'
import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'
import { STATIC_IMPORT_REGEX } from '@flex-development/import-regex'
import { split, trim } from '@flex-development/tutils'

/**
 * Finds all static import statements in `code`. Ignores matches in comments.
 *
 * @see {@linkcode StaticImport}
 * @see https://regex101.com/r/wlYQUN
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import
 *
 * @param {string} [code=''] - Code to evaluate
 * @return {StaticImport[]} Static import statement objects
 * @throws {NodeError<TypeError>} If `code` is not a string
 */
const findStaticImports = (code: string = ''): StaticImport[] => {
  validateString(code, 'code')

  return [...code.matchAll(STATIC_IMPORT_REGEX)].map(match => {
    const { 0: code = '', index: start = 0, groups = {} } = match
    const { assertion = '', imports = '', specifier = '', type = '' } = groups

    /**
     * Statement syntax kind.
     *
     * @const {StaticImport['syntax']} syntax
     */
    const syntax: StaticImport['syntax'] = imports === ''
      ? StatementSyntaxKind.SIDE_EFFECT
      : imports.startsWith('* as')
      ? StatementSyntaxKind.NAMESPACE
      : imports.startsWith('{')
      ? StatementSyntaxKind.NAMED
      : /^\w+$/.test(imports)
      ? StatementSyntaxKind.DEFAULT
      : /^\w+,\s*{/.test(imports)
      ? StatementSyntaxKind.DEFAULT_WITH_NAMED
      : StatementSyntaxKind.DEFAULT_WITH_NAMESPACE

    return {
      assertion,
      code,
      end: start + code.length,
      imports: syntax === StatementSyntaxKind.SIDE_EFFECT
        ? []
        : syntax === StatementSyntaxKind.NAMED
        ? split(imports.replace(/^{|}$/g, ''), ',')
          .map(trim)
          .filter(i => !!i.length)
        : syntax === StatementSyntaxKind.DEFAULT_WITH_NAMED
        ? split(imports, ',')
          .map(i => trim(i).replace(/^{|}$/g, ''))
          .map(trim)
          .filter(i => !!i.length)
        : syntax === StatementSyntaxKind.DEFAULT_WITH_NAMESPACE
        ? split(imports, ',')
          .map(trim)
          .filter(i => !!i.length)
        : [imports],
      kind: StatementKind.IMPORT,
      specifier,
      specifier_kind: getSpecifierKind(specifier),
      specifier_syntax: SpecifierSyntaxKind.STATIC,
      start,
      syntax,
      type: !!type
    }
  })
}

export default findStaticImports
