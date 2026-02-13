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
import { ok } from 'devlop'

export default resolveAlias

/**
 * Resolve an aliased `specifier`.
 *
 * @see {@linkcode ResolveAliasOptions}
 *
 * @this {void}
 *
 * @param {string} specifier
 *  The specifier using an alias
 * @param {ResolveAliasOptions | null | undefined} [options]
 *  Options for alias resolution
 * @return {string | null}
 *  The specifier of the aliased module
 */
function resolveAlias(
  this: void,
  specifier: string,
  options?: ResolveAliasOptions | null | undefined
): string | null {
  /**
   * The expansion key and pattern match.
   *
   * @const {PatternMatch | null} match
   */
  const match: PatternMatch | null = patternMatch(specifier, options?.aliases)

  /**
   * The resolved alias.
   *
   * @var {string | null} aliased
   */
  let aliased: string | null = null

  if (match) {
    ok(options, 'expected `options`')
    ok(options.aliases, 'expected `options.aliases`')

    aliased = resolveAliasTarget(options.aliases[match[0]], match[1])

    if (typeof aliased === 'string') {
      /**
       * The URL of the aliased module.
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

  return aliased
}

/**
 * Resolve a path alias target.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {unknown} target
 *  The path alias target to resolve
 * @param {string | null | undefined} [patternMatch]
 *  The pattern match, replaces `*` in `target`
 * @return {string | null}
 *  The matched alias
 */
function resolveAliasTarget(
  this: void,
  target: unknown,
  patternMatch?: string | null | undefined
): string | null {
  if (typeof target === 'string') {
    /**
     * The matched alias.
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
       * The resolved path alias.
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
