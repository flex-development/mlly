/**
 * @file extractStatements
 * @module mlly/lib/extractStatements
 */

import type { Statement } from '#src/interfaces'
import findDynamicImports from './find-dynamic-imports'
import findExports from './find-exports'
import findRequires from './find-requires'
import findStaticImports from './find-static-imports'

/**
 * Finds all `export`, `import`, `require`, and/or `require.resolve` statements
 * in `code`.
 *
 * @see [`findDynamicImports`](/find-dynamic-imports.ts)
 * @see [`findExports`](/find-exports.ts)
 * @see [`findRequires`](/find-requires.ts)
 * @see [`findStaticImports`](/find-static-imports.ts)
 *
 * @param {string} [code=''] - Code to extract statements from
 * @return {Statement[]} Extracted statements
 */
const extractStatements = (code: string = ''): Statement[] => {
  if (!code) return []

  return [
    ...findDynamicImports(code),
    ...findExports(code),
    ...findRequires(code),
    ...findStaticImports(code)
  ]
}

export default extractStatements
