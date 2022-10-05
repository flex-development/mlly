/**
 * @file findExports
 * @module mlly/lib/findExports
 */

import {
  EXPORT_DECLARATION_REGEX,
  EXPORT_NAMED_REGEX,
  EXPORT_STAR_REGEX
} from '#src/constants'
import type { ExportStatement } from '#src/interfaces'
import type { Declaration } from '#src/types'

/**
 * Finds all export statements in `code`.
 *
 * @param {string} code - Code to check
 * @return {ExportStatement[]} Export statement objects
 */
const findExports = (code: string): ExportStatement[] => {
  /**
   * Export statement objects.
   *
   * @const {ExportStatement[]} statements
   */
  const statements: ExportStatement[] = []

  // get declaration export statements
  for (const match of code.matchAll(EXPORT_DECLARATION_REGEX)) {
    const { 0: statement = '', index: start = 0, groups = {} } = match
    const { declaration = 'default', name = '' } = groups

    /**
     * {@link statement} copy.
     *
     * @const {string} stmt
     */
    const stmt: string = statement.trim()

    statements.push({
      code: stmt,
      declaration: declaration as Declaration,
      end: start + stmt.length,
      exports: [name === '' ? 'default' : name.trim()],
      specifier: undefined,
      start,
      type: declaration === 'default' ? 'default' : 'declaration'
    })
  }

  // get named export statements
  for (const match of code.matchAll(EXPORT_NAMED_REGEX)) {
    const { 0: statement = '', index: start = 0, groups = {} } = match
    const { exports: exp = '', specifier = '' } = groups

    statements.push({
      code: statement,
      declaration: undefined,
      end: start + statement.length,
      exports: exp.split(',').map(name => name.trim()),
      specifier,
      start,
      type: exp.trim() === 'default' ? 'default' : 'named'
    })
  }

  // get star export statements
  for (const match of code.matchAll(EXPORT_STAR_REGEX)) {
    const { 0: statement = '', index: start = 0, groups = {} } = match
    const { name = '*', specifier = '' } = groups

    statements.push({
      code: statement,
      declaration: undefined,
      end: start + statement.length,
      exports: [name === '*' ? name : name.replace(/(\w+)/, '* as $1').trim()],
      specifier,
      start,
      type: 'star'
    })
  }

  return statements
}

export default findExports
