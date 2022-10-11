/**
 * @file resolveAlias
 * @module mlly/lib/resolveAlias
 */

import { RESOLVE_EXTENSIONS } from '#src/constants'
import type { ResolveAliasOptions as Options } from '#src/interfaces'
import { getCompilerOptions } from '#src/internal'
import { createMatchPath, type MatchPath } from 'tsconfig-paths'
import upath from 'upath'
import toRelativeSpecifier from './to-relative-specifier'

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
    // get compiler options
    const { baseUrl: b = '.', paths: p = paths } = getCompilerOptions(tsconfig)

    // reset baseUrl and paths
    baseUrl = upath.resolve(upath.dirname(tsconfig), b)
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
    ? toRelativeSpecifier(match, parent)
    : match

  return match
}

export default resolveAlias
