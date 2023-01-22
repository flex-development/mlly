/**
 * @file Internal - getSubpaths
 * @module mlly/internal/getSubpaths
 */

import type { ModuleId } from '#src/types'
import isExportsSugar from '#src/utils/is-exports-sugar'
import type { Exports, Imports } from '@flex-development/pkg-types'
import { isNIL } from '@flex-development/tutils'

/**
 * Returns an array containing subpaths defined in the given package `context`,
 * a `package.json` [`exports`][1] or [`imports`][2] field.
 *
 * If `context` is using [exports sugar][3], the array will contain a single
 * subpath, `'.'`.
 *
 * [1]: https://nodejs.org/api/packages.html#exports
 * [2]: https://nodejs.org/api/packages.html#imports
 * [3]: https://nodejs.org/api/packages.html#exports-sugar
 *
 * @param {Exports | Imports | undefined} context - Package context
 * @param {boolean} internal - Package `imports` hint
 * @param {ModuleId} pkg - URL of relevant `package.json` file
 * @param {ModuleId} parent - URL of module to resolve from
 * @return {string[]} Subpaths defined in `context`
 */
const getSubpaths = (
  context: Exports | Imports | undefined,
  internal: boolean,
  pkg: ModuleId,
  parent: ModuleId
): string[] => {
  return isNIL(context)
    ? []
    : !internal && isExportsSugar(context, pkg, parent)
    ? ['.']
    : Object.keys(context as Imports | Record<string, Exports>)
}

export default getSubpaths
