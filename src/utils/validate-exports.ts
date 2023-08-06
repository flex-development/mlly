/**
 * @file validateExports
 * @module mlly/utils/validateExports
 */

import validateURLString from '#src/internal/validate-url-string'
import type { ModuleId } from '#src/types'
import {
  ERR_INVALID_PACKAGE_CONFIG,
  type NodeError
} from '@flex-development/errnode'
import type { Exports } from '@flex-development/pkg-types'
import {
  DOT,
  at,
  cast,
  isArray,
  isArrayIndex,
  isNIL,
  isObjectCurly,
  isString,
  type Optional
} from '@flex-development/tutils'
import { URL, fileURLToPath } from 'node:url'

/**
 * Validates the given package [`exports`][1] configuration and schema.
 *
 * [1]: https://nodejs.org/api/packages.html#exports
 *
 * @see {@linkcode Exports}
 * @see {@linkcode ModuleId}
 *
 * @param {Optional<Exports>} exports - Package `exports`
 * @param {ModuleId} pkg - URL of relevant `package.json` file
 * @param {ModuleId} parent - URL of module to resolve from
 * @return {true} `true` if `exports` configuration and schema are valid
 * @throws {NodeError<Error | TypeError>} If either `pkg` or `parent` is not a
 * string or an instance of {@linkcode URL}, or if `exports` configuration or
 * schema is invalid
 */
const validateExports = (
  exports: Optional<Exports>,
  pkg: ModuleId,
  parent: ModuleId
): true => {
  validateURLString(pkg, 'pkg')
  validateURLString(parent, 'parent')

  switch (true) {
    case isArray(exports):
      for (const item of cast<unknown[]>(exports)) {
        switch (true) {
          case !isObjectCurly(item) && !isString(item):
            throw new ERR_INVALID_PACKAGE_CONFIG(
              fileURLToPath(pkg),
              fileURLToPath(parent),
              'The "exports" array must contain either objects of package subpath keys, objects of condition name keys, or strings'
            )
          default:
            validateExports(
              cast<Record<string, Exports> | string>(item),
              pkg,
              parent
            )
            break
        }
      }

      break
    case isNIL(exports):
    case isString(exports):
      break
    case !isObjectCurly(exports):
      throw new ERR_INVALID_PACKAGE_CONFIG(
        fileURLToPath(pkg),
        fileURLToPath(parent),
        '"exports" must be null, undefined, a string, an object of package subpath keys or condition name keys, or an array containing objects of package subpath keys, objects of condition name keys, or strings'
      )
    default:
      exports = cast<Record<string, Exports>>(exports)

      /**
       * Keys defined in {@linkcode exports}.
       *
       * @const {string[]} keys
       */
      const keys: string[] = Object.getOwnPropertyNames(exports)

      // validate keys
      for (const [index, key] of keys.entries()) {
        // ensure key is not an array index
        if (isArrayIndex(key)) {
          throw new ERR_INVALID_PACKAGE_CONFIG(
            fileURLToPath(new URL(DOT, pkg)),
            fileURLToPath(parent),
            '"exports" cannot contain numeric property keys'
          )
        }

        // if more than one key in keys, ensure all keys are either syntactical
        // export conditions or subpath exports
        if (index) {
          /**
           * Key before {@linkcode key} in {@linkcode keys}.
           *
           * @const {string} prev
           */
          const prev: string = at(keys, index - 1)

          // ensure keys are syntactical export conditions or subpath exports
          if (
            (!key.startsWith(DOT) && prev.startsWith(DOT)) ||
            (key.startsWith(DOT) && !prev.startsWith(DOT))
          ) {
            throw new ERR_INVALID_PACKAGE_CONFIG(
              fileURLToPath(pkg),
              fileURLToPath(parent),
              '"exports" cannot contain some keys starting with \'.\' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.'
            )
          }
        }
      }

      break
  }

  return true
}

export default validateExports
