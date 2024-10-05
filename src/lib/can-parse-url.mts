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
 * @param {ModuleId} input
 *  The absolute or relative input URL to parse
 * @param {ModuleId | null | undefined} [base]
 *  Base URL to resolve against if `input` is not absolute
 * @return {boolean}
 *  `true` if `input` can be parsed to a `URL`
 */
function canParseUrl(
  input: ModuleId,
  base?: ModuleId | null | undefined
): boolean {
  try {
    new URL(input, base ?? undefined)
    return true
  } catch {
    return false
  }
}

export default canParseUrl
