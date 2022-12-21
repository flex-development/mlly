/**
 * @file toAbsoluteSpecifier
 * @module mlly/lib/toAbsoluteSpecifier
 */

import pathe from '@flex-development/pathe'
import { fileURLToPath, pathToFileURL, URL } from 'node:url'

/**
 * Converts `specifier` into an absolute specifier.
 *
 * ::: info
 * The absolute specifier will only include a file extension if `specifier`
 * includes a file extension.
 * :::
 *
 * @see {@linkcode URL}
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @param {URL | string} specifier - Module specifier to convert
 * @param {URL | string} [cwd=process.cwd()] - Current working directory
 * @return {string} `specifier` as absolute specifier (file url)
 */
const toAbsoluteSpecifier = (
  specifier: URL | string,
  cwd: URL | string = process.cwd()
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
