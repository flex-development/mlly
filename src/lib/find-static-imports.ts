/**
 * @file findStaticImports
 * @module mlly/lib/findStaticImports
 */

import type { StaticImport } from '#src/interfaces'
import { STATIC_IMPORT_REGEX } from '#src/internal'

/**
 * Finds all static import statements in `code`. Ignores matches in comments.
 *
 * @see {@link StaticImport}
 *
 * @param {string} code - Code to check
 * @return {StaticImport[]} Static import statement objects
 */
const findStaticImports = (code: string): StaticImport[] => {
  return [...code.matchAll(STATIC_IMPORT_REGEX)].map(match => {
    const { 0: statement = '', index: start = 0, groups = {} } = match
    const { imports = '', specifier = '' } = groups

    /**
     * `import * as <import>` check.
     *
     * @const {boolean} star
     */
    const star: boolean = imports.startsWith('* as')

    return {
      code: statement,
      end: start + statement.length,
      imports: star
        ? [imports.trim()]
        : imports
            .replace(/^type\s*|[{}]/gm, '')
            .split(/,\n?/)
            .map(name => name.trim()),
      specifier,
      start,
      type: star
        ? 'star'
        : /{(?<imports>[\w\t\n\r ,]+)}/gm.test(statement)
        ? 'named'
        : 'default'
    }
  })
}

export default findStaticImports
