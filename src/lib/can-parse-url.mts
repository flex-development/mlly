/**
 * @file canParseUrl
 * @module mlly/lib/canParseUrl
 */

import type { ModuleId } from '@flex-development/mlly'

/**
 * Check if `input` can be parsed to a {@linkcode URL}.
 *
 * > 👉 **Note**: If `input` is relative, `base` is required. If `input` is
 * > absolute, `base` is ignored.
 *
 * @see {@linkcode ModuleId}
 *
 * @param {unknown} input
 *  The absolute or relative input URL to parse
 * @param {unknown} [base]
 *  Base URL to resolve against if `input` is not absolute
 * @return {boolean}
 *  `true` if `input` can be parsed to a `URL`
 */
function canParseUrl(input: unknown, base?: unknown): boolean {
  try {
    new URL(input as ModuleId, (base ?? undefined) as ModuleId | undefined)
    return true
  } catch {
    return false
  }
}

export default canParseUrl
