/**
 * @file resolveAliases
 * @module mlly/lib/resolveAliases
 */

import type { ResolveAliasOptions } from '#src/interfaces'
import { loadTsconfig, type Tsconfig } from 'tsconfig-paths/lib/tsconfig-loader'
import upath from 'upath'
import extractStatements from './extract-statements'
import resolveAlias from './resolve-alias'

/**
 * Batch path alias resolution options.
 *
 * @see {@link ResolveAliasOptions}
 */
type Options = Omit<ResolveAliasOptions, 'baseUrl' | 'parent' | 'paths'>

/**
 * Resolves path aliases in `code`.
 *
 * @see [`resolveAlias`](./resolve-alias)
 *
 * @param {string} code - Code containing path aliases
 * @param {string} parent - Absolute path to file containing `code`
 * @param {Options} [options={}] - Resolve options
 * @param {string} [options.tsconfig=pathe.resolve('tsconfig.json')] - Tsconfig
 * @return {string} `code` unmodified or with path aliases resolved
 */
const resolveAliases = (
  code: string,
  parent: string,
  options: Options = {}
): string => {
  // set tsconfig path
  options.tsconfig = options.tsconfig ?? upath.resolve('tsconfig.json')

  /**
   * Tsconfig object.
   *
   * @const {Tsconfig | undefined} tsconfig
   */
  const tsconfig: Tsconfig | undefined = loadTsconfig(
    options.tsconfig,
    options.fileExists,
    options.readFile
  )

  // get compiler options
  const { compilerOptions = {} } = tsconfig ?? {}
  const { baseUrl = '.', paths = {} } = compilerOptions

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
      baseUrl: upath.resolve(upath.dirname(options.tsconfig), baseUrl),
      parent,
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
