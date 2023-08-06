/**
 * @file toRelativeSpecifier
 * @module mlly/utils/toRelativeSpecifier
 */

import validateURLString from '#src/internal/validate-url-string'
import type { ModuleId } from '#src/types'
import type { NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import { DOT } from '@flex-development/tutils'
import { URL, fileURLToPath } from 'node:url'

/**
 * Converts `specifier` into a relative specifier.
 *
 * ::: info
 * The relative specifier will only include a file extension if `specifier`
 * includes a file extension.
 * :::
 *
 * @see {@linkcode ModuleId}
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @param {ModuleId} specifier - Module specifier to convert
 * @param {ModuleId} parent - Parent module URL or path to resolve from
 * @return {string} `specifier` as relative specifier
 * @throws {NodeError<TypeError>} If either `specifier` or `parent` is not a
 * string or an instance of {@linkcode URL}
 */
const toRelativeSpecifier = (specifier: ModuleId, parent: ModuleId): string => {
  validateURLString(specifier, 'specifier')
  validateURLString(parent, 'parent')

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
  if (!specifier) specifier = DOT

  return specifier
}

export default toRelativeSpecifier
