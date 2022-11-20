/**
 * @file resolveAliases
 * @module mlly/lib/resolveAliases
 */

import type { ResolveAliasOptions } from '#src/interfaces'
import { getCompilerOptions } from '#src/internal'
import upath from 'upath'
import extractStatements from './extract-statements'
import resolveAlias from './resolve-alias'

/**
 * Resolves path aliases in `code`.
 *
 * @see {@linkcode ResolveAliasOptions}
 * @see {@linkcode resolveAlias}
 *
 * @param {string} code - Code containing path aliases
 * @param {ResolveAliasOptions} [options={}] - Resolve alias options
 * @return {string} `code` unmodified or with path aliases resolved
 */
const resolveAliases = (
  code: string,
  options: ResolveAliasOptions = {}
): string => {
  const { tsconfig } = options
  let { baseUrl = process.cwd(), paths = {} } = options

  // use baseUrl and paths from tsconfig
  if (tsconfig) {
    const { baseUrl: b = '.', paths: p = paths } = getCompilerOptions(tsconfig)

    // reset baseUrl and paths
    baseUrl = upath.resolve(upath.dirname(tsconfig), b)
    paths = p
  }

  // resolve path aliases
  for (const statement of extractStatements(code)) {
    // do nothing if missing module specifier
    if (!statement.specifier) continue

    /**
     * Resolved module specifier.
     *
     * @const {string} specifier
     */
    const specifier: string = resolveAlias(statement.specifier, {
      ...options,
      baseUrl,
      paths,
      tsconfig: undefined
    })

    // do nothing if specifier did not contain path alias
    if (specifier === statement.specifier) continue

    // replace path alias
    code = code.replace(
      statement.code,
      statement.code.replace(statement.specifier, specifier)
    )
  }

  return code
}

export default resolveAliases
