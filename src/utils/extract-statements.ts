/**
 * @file extractStatements
 * @module mlly/utils/extractStatements
 */

import type { Statement } from '#src/interfaces'
import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'
import { sort, trim } from '@flex-development/tutils'
import findDynamicImports from './find-dynamic-imports'
import findExports from './find-exports'
import findRequires from './find-requires'
import findStaticImports from './find-static-imports'

/**
 * Finds all `export`, `import`, and/or  `require` statements in `code`.
 *
 * Ignores matches in comments.
 *
 * @see {@linkcode findDynamicImports}
 * @see {@linkcode findExports}
 * @see {@linkcode findRequires}
 * @see {@linkcode findStaticImports}
 *
 * @param {string} [code=''] - Code to evaluate
 * @return {Statement[]} Extracted statements
 * @throws {NodeError<TypeError>} If `code` is not a string
 */
const extractStatements = (code: string = ''): Statement[] => {
  validateString(code, 'code')

  // code shorter than first shortest keyword => no possible matches
  if (trim(code).length < 'export'.length) return []

  return sort(
    [
      ...findDynamicImports(code),
      ...findExports(code),
      ...findRequires(code),
      ...findStaticImports(code)
    ],
    (s1: Statement, s2: Statement): number => s1.start - s2.start
  )
}

export default extractStatements
