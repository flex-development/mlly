/**
 * @file findExports
 * @module mlly/utils/findExports
 */

import {
  SpecifierSyntaxKind,
  StatementKind,
  StatementSyntaxKind
} from '#src/enums'
import type { ExportStatement } from '#src/interfaces'
import getSpecifierKind from '#src/internal/get-specifier-kind'
import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'
import {
  EXPORT_AGGREGATE_REGEX,
  EXPORT_DECLARATION_REGEX,
  EXPORT_DEFAULT_REGEX,
  EXPORT_LIST_REGEX
} from '@flex-development/export-regex'
import { cast, sort, split, trim } from '@flex-development/tutils'

/**
 * Finds all export statements in `code`. Ignores matches in comments.
 *
 * @see {@linkcode ExportStatement}
 * @see https://regex101.com/r/JtvRUt
 * @see https://regex101.com/r/8HpMrA
 * @see https://regex101.com/r/G7GhEt
 * @see https://regex101.com/r/KQEDdZ
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export
 *
 * @param {string} [code=''] - Code to evaluate
 * @return {ExportStatement[]} Export statement objects
 * @throws {NodeError<TypeError>} If `code` is not a string
 */
const findExports = (code: string = ''): ExportStatement[] => {
  validateString(code, 'code')

  /**
   * `export` statement objects.
   *
   * @const {ExportStatement[]} statements
   */
  const statements: ExportStatement[] = []

  // get aggregate export statements
  for (const match of code.matchAll(EXPORT_AGGREGATE_REGEX)) {
    const { 0: code = '', index: start = 0, groups = {} } = match
    const { exports = '', specifier = '', type = '' } = groups

    statements.push({
      code,
      declaration: null,
      end: start + code.length,
      exports: exports.startsWith('*')
        ? [exports]
        : split(exports.replace(/^{|}$/g, ''), ',')
            .map(trim)
            .filter(e => !!e.length),
      kind: StatementKind.EXPORT,
      modifiers: [],
      specifier,
      specifier_kind: getSpecifierKind(specifier),
      specifier_syntax: SpecifierSyntaxKind.STATIC,
      start,
      syntax: exports.startsWith('{')
        ? StatementSyntaxKind.NAMED
        : StatementSyntaxKind.NAMESPACE,
      type: !!type
    })
  }

  // get declaration export statements
  for (const match of code.matchAll(EXPORT_DECLARATION_REGEX)) {
    const { 0: code = '', index: start = 0, groups = {} } = match
    const { declaration = '', exports = '', modifiers = '' } = groups

    statements.push({
      code,
      declaration: cast(declaration),
      end: start + code.length,
      exports: /^\w+$/.test(exports)
        ? [exports]
        : split(exports.replace(/^[[{]|[\]}]$/g, ''), ',')
            .map(e => trim(e).replace(/\s*=\s*.*$/, ''))
            .filter(e => !!e.length),
      kind: StatementKind.EXPORT,
      modifiers:
        modifiers === ''
          ? []
          : split(modifiers, ' ')
              .map(trim)
              .filter(e => !!e.length),
      specifier: null,
      specifier_kind: null,
      specifier_syntax: null,
      start,
      syntax: StatementSyntaxKind.DECLARATION,
      type: false
    })
  }

  // get export default statements
  for (const match of code.matchAll(EXPORT_DEFAULT_REGEX)) {
    const { 0: code = '', index: start = 0, groups = {} } = match
    const { exports = '', kind: declaration = '', modifiers = '' } = groups

    statements.push({
      code,
      declaration: declaration ? cast(declaration) : null,
      end: start + code.length,
      exports: exports === '' ? [] : [exports],
      kind: StatementKind.EXPORT,
      modifiers:
        modifiers === ''
          ? []
          : split(modifiers, ' ')
              .map(trim)
              .filter(e => !!e.length),
      specifier: null,
      specifier_kind: null,
      specifier_syntax: null,
      start,
      syntax: StatementSyntaxKind.DEFAULT,
      type: false
    })
  }

  // get list export statements
  for (const match of code.matchAll(EXPORT_LIST_REGEX)) {
    const { 0: code = '', index: start = 0, groups = {} } = match
    const { exports = '', type = '' } = groups

    statements.push({
      code,
      declaration: null,
      end: start + code.length,
      exports: split(exports.replace(/^{|}$/g, ''), ',')
        .map(trim)
        .filter(e => !!e.length),
      kind: StatementKind.EXPORT,
      modifiers: [],
      specifier: null,
      specifier_kind: null,
      specifier_syntax: null,
      start,
      syntax: StatementSyntaxKind.LIST,
      type: !!type
    })
  }

  return sort(statements, (s1, s2): number => s1.start - s2.start)
}

export default findExports
