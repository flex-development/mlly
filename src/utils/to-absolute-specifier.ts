/**
 * @file toAbsoluteSpecifier
 * @module mlly/utils/toAbsoluteSpecifier
 */

import type { ModuleId } from '#src/types'
import { pathToFileURL } from 'node:url'
import toURL from './to-url'

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
 * @param {ModuleId} [cwd=pathToFileURL('./')] - Current working directory
 * @return {string} `specifier` as absolute specifier (file url)
 */
const toAbsoluteSpecifier = (
  specifier: ModuleId,
  cwd: ModuleId = pathToFileURL('./')
): string => toURL(specifier, cwd).href

export default toAbsoluteSpecifier
