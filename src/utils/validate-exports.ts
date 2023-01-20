/**
 * @file validateExports
 * @module mlly/utils/validateExports
 */

import isArrayIndex from '#src/internal/is-array-index'
import validateURLString from '#src/internal/validate-url-string'
import type { ModuleId } from '#src/types'
import {
  ERR_INVALID_PACKAGE_CONFIG,
  type NodeError
} from '@flex-development/errnode'
import type { Exports } from '@flex-development/pkg-types'
import { isNIL } from '@flex-development/tutils'
import { URL, fileURLToPath } from 'node:url'

/**
 * Validates the given package [`exports`][1] configuration and schema.
 *
 * [1]: https://nodejs.org/api/packages.html#exports
 *
 * @see {@linkcode Exports}
 * @see {@linkcode ModuleId}
 *
 * @param {Exports | undefined} exports - Package `exports`
 * @param {ModuleId} pkg - URL of relevant `package.json` file
 * @param {ModuleId} parent - URL of module to resolve from
 * @return {true} `true` if `exports` configuration and schema are valid
 * @throws {NodeError<Error | TypeError>} If either `pkg` or `parent` is not an
 * instance of {@linkcode URL} or a string, or if `exports` configuration or
 * schema is invalid
 */
const validateExports = (
  exports: Exports | undefined,
  pkg: ModuleId,
  parent: ModuleId
): true => {
  switch (true) {
    case Array.isArray(exports):
      for (const item of exports as unknown[]) {
        switch (true) {
          case Array.isArray(item):
          case isNIL(item):
          case typeof item !== 'object' && typeof item !== 'string':
            throw new ERR_INVALID_PACKAGE_CONFIG(
              fileURLToPath(pkg),
              fileURLToPath(parent),
              'The "exports" array must contain either objects of package subpath keys, objects of condition name keys, or strings'
            )
          default:
            validateExports(
              item as Record<string, Exports> | string,
              pkg,
              parent
            )
            break
        }
      }

      break
    case isNIL(exports):
    case typeof exports === 'string':
      break
    case typeof exports !== 'object':
      throw new ERR_INVALID_PACKAGE_CONFIG(
        fileURLToPath(pkg),
        fileURLToPath(parent),
        '"exports" must be null, undefined, a string, an object of package subpath keys or condition name keys, or an array containing objects of package subpath keys, objects of condition name keys, or strings'
      )
    default:
      exports = exports as Record<string, Exports>

      validateURLString(pkg, 'pkg')
      validateURLString(parent, 'parent')

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
            fileURLToPath(new URL('.', pkg)),
            fileURLToPath(parent),
            '"exports" cannot contain numeric property keys'
          )
        }

        // if more than one key in keys, ensure all keys are either syntactical
        // export conditions or subpath exports
        if (index > 0) {
          /**
           * Key before {@linkcode key} in {@linkcode keys}.
           *
           * @const {string} prev
           */
          const prev: string = keys[index - 1]!

          // ensure keys are syntactical export conditions or subpath exports
          if (
            (!key.startsWith('.') && prev.startsWith('.')) ||
            (key.startsWith('.') && !prev.startsWith('.'))
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
