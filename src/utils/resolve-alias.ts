/**
 * @file resolveAlias
 * @module mlly/utils/resolveAlias
 */

import type { ParsedModuleId, ResolveAliasOptions } from '#src/interfaces'
import regexp from '#src/internal/escape-reg-exp'
import validateArraySet from '#src/internal/validate-array-set'
import validateBoolean from '#src/internal/validate-boolean'
import validateObject from '#src/internal/validate-object'
import validateString from '#src/internal/validate-string'
import validateURLString from '#src/internal/validate-url-string'
import type { NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import { CompareResult, isNIL, type Nullable } from '@flex-development/tutils'
import { URL, pathToFileURL } from 'node:url'
import compareSubpaths from './compare-subpaths'
import CONDITIONS from './conditions'
import parseModuleId from './parse-module-id'
import PATTERN_CHARACTER from './pattern-character'
import RESOLVE_EXTENSIONS from './resolve-extensions'
import resolveModule from './resolve-module'
import toBareSpecifier from './to-bare-specifier'
import toRelativeSpecifier from './to-relative-specifier'
import toURL from './to-url'

/**
 * Resolves a path alias in the given module `specifier`; does nothing if a path
 * match isn't found.
 *
 * @see {@linkcode ResolveAliasOptions}
 *
 * @async
 *
 * @param {string} specifier - Module specifier to evaluate
 * @param {ResolveAliasOptions} [options={}] - Resolution options
 * @return {Promise<string>} Resolved specifier or original module specifier
 * @throws {NodeError}
 */
const resolveAlias = async (
  specifier: string,
  options: ResolveAliasOptions = {}
): Promise<string> => {
  const {
    absolute = true,
    aliases = {},
    condition = 'default',
    conditions = CONDITIONS,
    cwd = pathToFileURL('.'),
    ext,
    extensions = RESOLVE_EXTENSIONS,
    parent = import.meta.url,
    preserveSymlinks = false
  } = options

  // ensure specifier is a string
  validateString(specifier, 'specifier')

  // ensure option schemas
  validateBoolean(absolute, 'options.absolute')
  validateObject(aliases, 'options.aliases')
  validateString(condition, 'options.condition')
  validateURLString(cwd, 'options.cwd')
  validateArraySet(extensions, 'options.extensions')
  validateURLString(parent, 'options.parent')
  validateBoolean(preserveSymlinks, 'options.preserveSymlinks')

  /**
   * Parsed module id.
   *
   * **Note**: Ensures {@linkcode specifier} is a valid module specifier.
   *
   * @const {ParsedModuleId} id
   */
  const id: ParsedModuleId = parseModuleId(specifier, {
    parent: toURL(parent),
    pkgname: false
  })

  /**
   * Path aliases defined in {@linkcode aliases}.
   *
   * @const {string[]} keys
   */
  const keys: string[] = Object.keys(aliases).sort(compareSubpaths)

  /**
   * Path alias in {@linkcode aliases} that maps to {@linkcode specifier}.
   *
   * @var {Nullable<string>} key
   */
  let alias: Nullable<string> = null

  /**
   * Everything after {@linkcode alias} in {@linkcode specifier}.
   *
   * @var {string} trail
   */
  let trail: string = ''

  // match specifier to alias
  for (const key of keys) {
    /**
     * Index of {@linkcode PATTERN_CHARACTER} in {@linkcode key}.
     *
     * @const {number} p
     */
    const pattern: number = key.indexOf(PATTERN_CHARACTER)

    // no pattern character => need exact match for alias
    if (pattern === -1 && key === id.raw) {
      alias = key
      break
    }

    // pattern character => need best match for alias
    if (pattern !== -1 && id.raw.startsWith(key.slice(0, pattern))) {
      /**
       * Everything after pattern character (`*`) in {@linkcode key}.
       *
       * @const {string} trailer
       */
      const trailer: string = key.slice(pattern + 1)

      // best match found => reset key and base
      if (
        id.raw.length >= key.length &&
        id.raw.endsWith(trailer) &&
        compareSubpaths(alias ?? '', key) === CompareResult.GREATER_THAN &&
        key.lastIndexOf(PATTERN_CHARACTER) === pattern
      ) {
        alias = key
        trail = id.raw.slice(pattern, id.raw.length - trailer.length)
      }
    }
  }

  // exit early if alias was not found or alias does not map any paths
  if (alias === null || isNIL(aliases[alias])) return specifier

  /**
   * URL of directory to resolve non-absolute modules from.
   *
   * @const {string} base
   */
  const base: string = toURL(cwd).href.replace(/\/$/, '') + pathe.sep

  /**
   * Resolved module URL.
   *
   * @var {Nullable<URL>} url
   */
  let url: Nullable<URL> = null

  // try resolving path alias
  for (let segment of [aliases[alias]!].flat()) {
    // replace pattern character in segment with trail of specifier
    if (segment.includes(PATTERN_CHARACTER)) {
      segment = segment.replace(
        new RegExp(`${regexp(PATTERN_CHARACTER)}$`),
        trail
      )
    }

    /**
     * Absolute paths to modules to try resolving.
     *
     * @var {Set<string>} tries
     */
    let tries: Set<string> = new Set(
      [
        '',
        ...[...extensions].map(ext => pathe.formatExt(ext)),
        ...[...extensions].map(ext => '/index' + pathe.formatExt(ext))
      ]
        .map((suffix: string) => segment + suffix)
        .filter((segment: string) => segment.length > 0)
        .map((segment: string) => new URL(segment, base).pathname)
    )

    // add attempt to resolve possible package export
    if (segment.startsWith('node_modules')) {
      const [trypath = ''] = [...tries]
      tries = new Set([trypath.replace(/.*\/node_modules\//, ''), ...tries])
    }

    // find first resolvable module
    for (const trypath of tries) {
      try {
        url = await resolveModule(trypath, {
          condition,
          conditions,
          ext,
          extensions,
          parent: toURL(parent),
          preserveSymlinks
        })

        // exit if module was resolved
        break
      } catch {
        continue
      }
    }

    // stop checking path segments if path alias was resolved
    if (url) break
  }

  return url
    ? absolute
      ? url.href
      : /\/node_modules\//.test(url.href)
      ? toBareSpecifier(url, toURL(parent), new Set(conditions))
      : toRelativeSpecifier(url, toURL(parent))
    : specifier
}

export default resolveAlias
