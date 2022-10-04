/**
 * @file findDynamicImports
 * @module mlly/lib/findDynamicImports
 */

import { DYNAMIC_IMPORT_REGEX } from '#src/constants'
import type { DynamicImport } from '#src/interfaces'

/**
 * Finds all dynamic import statements in `code`.
 *
 * @param {string} code - Code to check
 * @return {DynamicImport[]} Dynamic import statement objects
 */
const findDynamicImports = (code: string): DynamicImport[] => {
  return [...code.matchAll(DYNAMIC_IMPORT_REGEX)].map(match => {
    const { 0: statement, index, groups = {} } = match

    return {
      code: statement!,
      end: index! + statement!.length,
      imports: groups.name
        ? [groups.name.trim()]
        : groups.names?.split(',').map(name => name.trim()) ?? [],
      specifier: groups.expression!.replace(/["']/g, ''),
      specifier_type: /^["']/g.test(groups.expression!) ? 'static' : 'dynamic',
      start: index!,
      type: 'dynamic'
    }
  })
}

export default findDynamicImports
