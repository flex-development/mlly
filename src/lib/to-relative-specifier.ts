/**
 * @file toRelativeSpecifier
 * @module mlly/lib/toRelativeSpecifier
 */

import { fileURLToPath, URL } from 'node:url'
import * as pathe from 'pathe'

/**
 * Converts `specifier` into a relative specifier.
 *
 * **Note**: The returned specifier will only include a file extension if the
 * original specifier includes an extension.
 *
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @param {URL | string} specifier - Module specifier to convert
 * @param {URL | string} parent - Parent module URL or path to resolve from
 * @return {string} `specifier` as relative specifier
 */
const toRelativeSpecifier = (
  specifier: URL | string,
  parent: URL | string
): string => {
  // convert file url objects to file url strings
  if (parent instanceof URL) parent = parent.href
  if (specifier instanceof URL) specifier = specifier.href

  // convert file url strings to paths
  if (parent.startsWith('file:')) parent = fileURLToPath(parent)
  if (specifier.startsWith('file:')) specifier = fileURLToPath(specifier)

  return pathe
    .relative(pathe.dirname(parent), specifier)
    .replace(/^(\w)/, './$1')
}

export default toRelativeSpecifier
