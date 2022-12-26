/**
 * @file toRelativeSpecifier
 * @module mlly/lib/toRelativeSpecifier
 */

import pathe from '@flex-development/pathe'
import { fileURLToPath, URL } from 'node:url'

/**
 * Converts `specifier` into a relative specifier.
 *
 * ::: info
 * The relative specifier will only include a file extension if `specifier`
 * includes a file extension.
 * :::
 *
 * @see {@linkcode URL}
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

  // convert specifier to relative specifier
  specifier = pathe
    .relative(pathe.resolve(parent), pathe.resolve(specifier))
    .replace(/^\.\.\/?/, '')
    .replace(/^(\w)/, './$1')

  // set specifier to dot character if empty string
  // this occurs when specifier is a directory, but is not fully specified
  if (!specifier) specifier = '.'

  return specifier
}

export default toRelativeSpecifier
