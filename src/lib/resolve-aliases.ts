/**
 * @file resolveAliases
 * @module mlly/lib/resolveAliases
 */

import type { AliasResolverOptions } from '#src/interfaces'
import * as pathe from 'pathe'
import { loadTsconfig, type Tsconfig } from 'tsconfig-paths/lib/tsconfig-loader'
import extractStatements from './extract-statements'
import resolveAlias from './resolve-alias'

/**
 * Batch path alias resolution options.
 *
 * @see {@link AliasResolverOptions}
 */
type Options = Omit<AliasResolverOptions, 'baseUrl' | 'paths' | 'url'>

/**
 * Resolves path aliases in `code`.
 *
 * @see [`resolveAlias`](./resolve-alias)
 *
 * @param {string} code - Code containing path aliases
 * @param {string} url - Absolute path to file containing `code`
 * @param {Options} [options={}] - Resolve options
 * @param {string} [options.tsconfig=pathe.resolve('tsconfig.json')] - Tsconfig
 * @return {string} `code` unmodified or with path aliases resolved
 */
const resolveAliases = (
  code: string,
  url: string,
  options: Options = {}
): string => {
  // set tsconfig path
  options.tsconfig = options.tsconfig ?? pathe.resolve('tsconfig.json')

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
      baseUrl: pathe.resolve(pathe.dirname(options.tsconfig), baseUrl),
      paths,
      tsconfig: undefined,
      url
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
