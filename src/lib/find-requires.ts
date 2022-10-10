/**
 * @file findRequires
 * @module mlly/lib/findRequires
 */

import type { RequireStatement } from '#src/interfaces'
import { REQUIRE_STATEMENT_REGEX } from '#src/internal'

/**
 * Finds all `require` and `require.resolve` statements in `code`.
 *
 * @param {string} code - Code to check
 * @return {RequireStatement[]} Require statement objects
 */
const findRequires = (code: string): RequireStatement[] => {
  return [...code.matchAll(REQUIRE_STATEMENT_REGEX)].map(match => {
    const { 0: statement = '', index: start = 0, groups = {} } = match
    const { imports = '', specifier = '', type = '' } = groups

    return {
      code: statement,
      end: start + statement.length,
      imports:
        imports === '' || type === 'require.resolve'
          ? []
          : /const *\w/.test(statement)
          ? ['default']
          : imports.split(',').map(name => name.trim()),
      specifier,
      start,
      type: type as RequireStatement['type']
    }
  })
}

export default findRequires
