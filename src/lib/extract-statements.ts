/**
 * @file extractStatements
 * @module mlly/lib/extractStatements
 */

import type { Statement } from '#src/interfaces'
import validateString from '#src/internal/validate-string'
import type { NodeError } from '@flex-development/errnode'
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
  if (code.trim().length < 'export'.length) return []

  return [
    ...findDynamicImports(code),
    ...findExports(code),
    ...findRequires(code),
    ...findStaticImports(code)
  ]
}

export default extractStatements
