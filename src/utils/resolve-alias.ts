/**
 * @file resolveAlias
 * @module mlly/utils/resolveAlias
 */

import type { ResolveAliasOptions } from '#src/interfaces'
import getCompilerOptions from '#src/internal/get-compiler-options'
import pathe from '@flex-development/pathe'
import { createMatchPath, type MatchPath } from 'tsconfig-paths'
import RESOLVE_EXTENSIONS from './resolve-extensions'
import toRelativeSpecifier from './to-relative-specifier'

/**
 * Resolves a path alias in `specifier`; does nothing if a path match isn't
 * found.
 *
 * If `options.tsconfig` is found, `options.baseUrl` and `options.paths` will
 * be overridden with values from the config file.
 *
 * @see {@linkcode ResolveAliasOptions}
 *
 * @param {string} specifier - Module specifier
 * @param {ResolveAliasOptions} [options={}] - Resolve alias options
 * @return {string} `specifier` unmodified or with path alias resolved
 */
const resolveAlias = (
  specifier: string,
  options: ResolveAliasOptions = {}
): string => {
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
   * Possible path match for {@linkcode specifier}.
   *
   * @var {string | undefined} match
   */
  let match: string | undefined = matcher(specifier, readFile, fileExists, [
    ...extensions
  ])

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
