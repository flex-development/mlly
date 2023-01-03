/**
 * @file findDynamicImports
 * @module mlly/lib/findDynamicImports
 */

import { SpecifierKind, StatementKind, SyntaxKind } from '#src/enums'
import type { DynamicImport } from '#src/interfaces'
import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'
import { DYNAMIC_IMPORT_REGEX } from '@flex-development/import-regex'

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

    return {
      code,
      end: start + code.length,
      expression,
      imports:
        imports === ''
          ? []
          : imports
              .replace(/^{|}$/g, '')
              .split(',')
              .map(e => e.trim())
              .filter(e => e.length > 0),
      kind: StatementKind.IMPORT,
      options,
      specifier: specifier.replace(/^["']|["']$/g, ''),
      specifier_kind: /^["']/g.test(specifier)
        ? SpecifierKind.STATIC
        : SpecifierKind.DYNAMIC,
      start,
      syntax: SyntaxKind.DYNAMIC
    }
  })
}

export default findDynamicImports
