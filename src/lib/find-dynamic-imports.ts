/**
 * @file findDynamicImports
 * @module mlly/lib/findDynamicImports
 */

import type { DynamicImport } from '#src/interfaces'
import { DYNAMIC_IMPORT_REGEX } from '#src/internal'

/**
 * Finds all dynamic import statements in `code`.
 *
 * @param {string} code - Code to check
 * @return {DynamicImport[]} Dynamic import statement objects
 */
const findDynamicImports = (code: string): DynamicImport[] => {
  return [...code.matchAll(DYNAMIC_IMPORT_REGEX)].map(match => {
    const { 0: statement = '', index: start = 0, groups = {} } = match
    const { expression = '', name = '', names = '' } = groups

    return {
      code: statement,
      end: start + statement.length,
      imports: name.trim()
        ? [name.trim()]
        : names.trim()
        ? names.split(',').map(name => name.trim())
        : [],
      specifier: expression.replace(/["']/g, ''),
      specifier_type: /^["']/g.test(expression) ? 'static' : 'dynamic',
      start,
      type: 'dynamic'
    }
  })
}

export default findDynamicImports
