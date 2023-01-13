/**
 * @file toAbsoluteSpecifier
 * @module mlly/utils/toAbsoluteSpecifier
 */

import type { ModuleId } from '#src/types'
import pathe from '@flex-development/pathe'
import { URL, fileURLToPath, pathToFileURL } from 'node:url'

/**
 * Converts `specifier` into an absolute specifier.
 *
 * ::: info
 * The absolute specifier will only include a file extension if `specifier`
 * includes a file extension.
 * :::
 *
 * @see {@linkcode ModuleId}
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @param {ModuleId} specifier - Module specifier to convert
 * @param {ModuleId} [cwd=process.cwd()] - Current working directory
 * @return {string} `specifier` as absolute specifier (file url)
 */
const toAbsoluteSpecifier = (
  specifier: ModuleId,
  cwd: ModuleId = process.cwd()
): string => {
  // convert file url objects to file url strings
  if (cwd instanceof URL) cwd = cwd.href
  if (specifier instanceof URL) specifier = specifier.href

  // convert file url strings to paths
  if (cwd.startsWith('file:')) cwd = fileURLToPath(cwd)
  if (specifier.startsWith('file:')) specifier = fileURLToPath(specifier)

  // convert non-absolute specifier to absolute specifier
  if (!pathe.isAbsolute(specifier)) specifier = pathe.resolve(cwd, specifier)

  // convert cwd to file url string
  cwd = pathToFileURL(cwd).href.replace(/\/$/, '') + '/'

  return new URL(specifier, cwd).href
}

export default toAbsoluteSpecifier
