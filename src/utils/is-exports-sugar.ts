/**
 * @file isExportsSugar
 * @module mlly/utils/isExportsSugar
 */

import type { ModuleId } from '#src/types'
import type { NodeError } from '@flex-development/errnode'
import type { Exports } from '@flex-development/pkg-types'
import { isNIL } from '@flex-development/tutils'
import validateExports from './validate-exports'

/**
 * Checks if the given package [`exports`][1] value is using [exports sugar][2].
 *
 * [1]: https://nodejs.org/api/packages.html#exports
 * [2]: https://nodejs.org/api/packages.html#exports-sugar
 *
 * @see {@linkcode Exports}
 * @see {@linkcode ModuleId}
 *
 * @param {Exports | undefined} exports - Package `exports`
 * @param {ModuleId} pkg - URL of relevant `package.json` file
 * @param {ModuleId} parent - URL of module to resolve from
 * @return {boolean} `true` if `exports` is using exports sugar
 * @throws {NodeError<Error | TypeError>} If either `pkg` or `parent` is not an
 * instance of {@linkcode URL} or a string, or if `exports` configuration or
 * schema is invalid
 */
const isExportsSugar = (
  exports: Exports | undefined,
  pkg: ModuleId,
  parent: ModuleId
): boolean => {
  /**
   * [Exports sugar][1] check.
   *
   * [1]: https://nodejs.org/api/packages.html#exports-sugar
   *
   * @var {boolean} sugar
   */
  let sugar: boolean = false

  // check if exports sugar is being used
  switch (true) {
    case Array.isArray(exports):
    case typeof exports === 'string':
      sugar = true
      break
    case isNIL(exports):
    case typeof exports !== 'object':
      sugar = false
      break
    default:
      exports = exports as Record<string, Exports>

      /*
       * Validate exports object configuration.
       *
       * This ensures the exports object is either an object of package subpath
       * keys (i.e. keys starting with '.') or an object of main entry condition
       * name keys (i.e. keys not starting with '.') only. An error will be
       * thrown otherwise. This also means only the first key in `keys` needs to
       * be checked for exports sugar usage.
       */
      validateExports(exports, pkg, parent)

      // check for exports sugar
      sugar = !Object.getOwnPropertyNames(exports)[0]?.startsWith('.')
  }

  return sugar
}

export default isExportsSugar
