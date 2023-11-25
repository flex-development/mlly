/**
 * @file findDynamicImports
 * @module mlly/utils/findDynamicImports
 */

import {
  SpecifierSyntaxKind,
  StatementKind,
  StatementSyntaxKind
} from '#src/enums'
import type { DynamicImport } from '#src/interfaces'
import dequote from '#src/internal/dequote'
import getSpecifierKind from '#src/internal/get-specifier-kind'
import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'
import { DYNAMIC_IMPORT_REGEX } from '@flex-development/import-regex'
import { split, trim } from '@flex-development/tutils'

/**
 * Finds all dynamic import statements in `code`. Ignores matches in comments.
 *
 * @see {@linkcode DynamicImport}
 * @see https://regex101.com/r/PTPAvU
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import
 *
 * @param {string} [code=''] - Code to evaluate
 * @return {DynamicImport[]} Dynamic import statement objects
 * @throws {NodeError<TypeError>} If `code` is not a string
 */
const findDynamicImports = (code: string = ''): DynamicImport[] => {
  validateString(code, 'code')

  return [...code.matchAll(DYNAMIC_IMPORT_REGEX)].map(match => {
    const { 0: code = '', index: start = 0, groups = {} } = match
    const {
      expression = '',
      imports = '',
      options = '',
      specifier = ''
    } = groups

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
      expression,
      imports: imports === ''
        ? []
        : split(imports.replace(/^{|}$/g, ''), ',')
          .map(trim)
          .filter(e => !!e.length),
      kind: StatementKind.IMPORT,
      options,
      specifier: dequote(specifier),
      specifier_kind: specifier_syntax === SpecifierSyntaxKind.DYNAMIC
        ? null
        : getSpecifierKind(specifier),
      specifier_syntax,
      start,
      syntax: StatementSyntaxKind.DYNAMIC
    }
  })
}

export default findDynamicImports
