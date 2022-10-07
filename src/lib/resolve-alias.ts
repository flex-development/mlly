/**
 * @file resolveAlias
 * @module mlly/lib/resolveAlias
 */

import { RESOLVE_EXTENSIONS } from '#src/constants'
import type { ResolveAliasOptions as Options } from '#src/interfaces'
import * as pathe from 'pathe'
import { createMatchPath, type MatchPath } from 'tsconfig-paths'
import { loadTsconfig, type Tsconfig } from 'tsconfig-paths/lib/tsconfig-loader'

/**
 * Resolves a path alias in `specifier`.
 *
 * Does nothing if a path match isn't found.
 *
 * If `options.tsconfig` is found, `options.baseUrl` and `options.paths` will
 * be overridden with values from the config file.
 *
 * @see https://github.com/dividab/tsconfig-paths
 *
 * @param {string} specifier - Module specifier
 * @param {Options} [options={}] - Resolve options
 * @return {string} `specifier` unmodified or with path alias resolved
 */
const resolveAlias = (specifier: string, options: Options = {}): string => {
  const {
    extensions = RESOLVE_EXTENSIONS,
    fileExists,
    mainFields = ['main', 'module'],
    parent,
    readFile,
    tsconfig
  } = options

  // get initial baseUrl and paths
  let { baseUrl = process.cwd(), paths = {} } = options

  // use baseUrl and paths from tsconfig
  if (tsconfig) {
    /**
     * Tsconfig object.
     *
     * @const {Tsconfig | undefined} config
     */
    const config: Tsconfig | undefined = loadTsconfig(
      tsconfig,
      fileExists,
      readFile
    )

    // get compiler options
    const { compilerOptions = {} } = config ?? {}
    const { baseUrl: b = '.', paths: p = paths } = compilerOptions

    // reset baseUrl and paths
    baseUrl = pathe.resolve(pathe.dirname(tsconfig), b)
    paths = p
  }

  /**
   * Path matching function.
   *
   * @const {MatchPath} matcher
   */
  const matcher: MatchPath = createMatchPath(
    baseUrl,
    paths,
    mainFields,
    baseUrl.length > 0
  )

  /**
   * Possible path match for {@link specifier}.
   *
   * @var {string | undefined} match
   */
  let match: string | undefined = matcher(
    specifier,
    readFile,
    fileExists,
    extensions
  )

  // return specifier if path match was not found
  if (!match) return specifier

  // convert match to bare or relative specifier
  match = /\/node_modules\//.test(match)
    ? match.replace(/.+\/node_modules\//, '')
    : parent
    ? pathe
        .relative(pathe.dirname(parent), match)
        .replace(/^(\w)/, './$1')
        .replace(/(\/index)$/, '')
    : match

  return match
}

export default resolveAlias
