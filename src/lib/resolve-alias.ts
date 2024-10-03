/**
 * @file resolveAlias
 * @module mlly/lib/resolveAlias
 */

import chars from '#internal/chars'
import cwd from '#lib/cwd'
import isRelativeSpecifier from '#lib/is-relative-specifier'
import patternMatch from '#lib/pattern-match'
import toRelativeSpecifier from '#lib/to-relative-specifier'
import type { PatternMatch, ResolveAliasOptions } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

export default resolveAlias

/**
 * Resolve an aliased `specifier`.
 *
 * @see {@linkcode ResolveAliasOptions}
 *
 * @param {string} specifier
 *  The module specifier to resolve
 * @param {ResolveAliasOptions | null | undefined} [options]
 *  Alias resolution options
 * @return {string | null }
 *  Specifier of aliased module or `null` if path alias match is not found
 */
function resolveAlias(
  specifier: string,
  options?: ResolveAliasOptions | null | undefined
): string | null {
  /**
   * Resolved alias.
   *
   * @var {string | null} aliased
   */
  let aliased: string | null = null

  if (options) {
    if (typeof options.aliases === 'object' && options.aliases) {
      /**
       * Tuple containing expansion key and pattern match.
       *
       * @const {PatternMatch | null} match
       */
      const match: PatternMatch | null = patternMatch(
        specifier,
        options.aliases
      )

      if (match) {
        aliased = resolveAliasTarget(options.aliases[match[0]], match[1])

        if (typeof aliased === 'string') {
          /**
           * URL of aliased module.
           *
           * @const {URL} url
           */
          const url: URL = new URL(aliased, options.cwd ?? cwd())

          if (options.absolute) {
            aliased = url.href
          } else if (options.parent) {
            aliased = toRelativeSpecifier(url, options.parent)
          }
        }
      }
    }
  }

  return aliased
}

/**
 * Resolve a path alias target.
 *
 * @internal
 *
 * @param {unknown} target
 *  The path alias target to resolve
 * @param {string | null | undefined} [patternMatch]
 *  Pattern match, replaces `*` in `target`
 * @return {string | null}
 *  Matched alias
 */
function resolveAliasTarget(
  target: unknown,
  patternMatch?: string | null | undefined
): string | null {
  if (typeof target === 'string') {
    /**
     * Matched alias.
     *
     * @var {string} match
     */
    let match: string = typeof patternMatch === 'string'
      ? target.replace(chars.asterisk, patternMatch)
      : target

    if (!isRelativeSpecifier(match)) match = pathe.dot + pathe.sep + match
    return match
  }

  if (Array.isArray<string | null | undefined>(target)) {
    for (const targetValue of target) {
      /**
       * Resolved path alias.
       *
       * @const {string | null} resolved
       */
      const resolved: string | null = resolveAliasTarget(
        targetValue,
        patternMatch
      )

      if (typeof resolved === 'string') return resolved
    }
  }

  return null
}
