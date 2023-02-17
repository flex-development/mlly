/**
 * @file parseSubpath
 * @module mlly/utils/parseSubpath
 */

import type {
  ParseSubpathOptions,
  ParsedModuleId,
  ParsedSubpath
} from '#src/interfaces'
import getSubpaths from '#src/internal/get-subpaths'
import isArrayIndex from '#src/internal/is-array-index'
import invalidSegmentRegex from '#src/internal/regex-invalid-segment'
import PACKAGE_NAME_REGEX from '#src/internal/regex-package-name'
import validateArraySet from '#src/internal/validate-array-set'
import validateBoolean from '#src/internal/validate-boolean'
import validateString from '#src/internal/validate-string'
import validateURLString from '#src/internal/validate-url-string'
import {
  ERR_INVALID_PACKAGE_CONFIG,
  ERR_INVALID_PACKAGE_TARGET,
  ERR_PACKAGE_IMPORT_NOT_DEFINED,
  ERR_PACKAGE_PATH_NOT_EXPORTED,
  ErrorCode,
  type NodeError
} from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import type { Exports, Imports } from '@flex-development/pkg-types'
import { CompareResult, isNIL, type Nullable } from '@flex-development/tutils'
import { URL, fileURLToPath, pathToFileURL } from 'node:url'
import compareSubpaths from './compare-subpaths'
import CONDITIONS from './conditions'
import isExportsSugar from './is-exports-sugar'
import parseModuleId from './parse-module-id'
import PATTERN_CHARACTER from './pattern-character'

/**
 * Creates an object representation of a subpath export or import from the given
 * module `specifier` after ensuring the subpath defined in `specifier` is also
 * defined in the given package `context`, a `package.json` [`exports`][1] or
 * [`imports`][2] field.
 *
 * ::: warning
 * Does **not** guarantee `specifier` resolves to an existing module.
 * :::
 *
 * [1]: https://nodejs.org/api/packages.html#exports
 * [2]: https://nodejs.org/api/packages.html#imports
 *
 * @see {@linkcode Exports}
 * @see {@linkcode Imports}
 * @see {@linkcode ParseSubpathOptions}
 * @see {@linkcode ParsedSubpath}
 * @see https://nodejs.org/api/packages.html#subpath-exports
 * @see https://nodejs.org/api/packages.html#subpath-imports
 *
 * @param {string} specifier - Module specifier to evaluate
 * @param {Exports | Imports | undefined} context - Package context
 * @param {ParseSubpathOptions} options - Parsing options
 * @return {ParsedSubpath} Object representing package subpath
 * @throws {NodeError<Error | TypeError>}
 */
const parseSubpath = (
  specifier: string,
  context: Exports | Imports | undefined,
  options: ParseSubpathOptions
): ParsedSubpath => {
  const {
    condition = 'default',
    conditions = CONDITIONS,
    dir,
    internal = specifier.startsWith('#'),
    parent
  } = options

  // ensure specifier is a string
  validateString(specifier, 'specifier')

  // ensure option schemas
  validateString(condition, 'options.condition')
  validateArraySet(conditions, 'options.conditions')
  validateURLString(dir, 'options.dir')
  validateBoolean(internal, 'options.internal')
  validateURLString(parent, 'options.parent')

  /**
   * Parsed module id.
   *
   * **Note**: Ensures {@linkcode specifier} begins with a valid package name or
   * is a valid [subpath import][1].
   *
   * [1]: https://nodejs.org/api/packages.html#subpath-imports
   *
   * @const {ParsedModuleId} id
   */
  const id: ParsedModuleId = parseModuleId(specifier, {
    internal,
    parent,
    pkgname: !internal
  })

  /**
   * Absolute path to directory containing relevant `package.json` file.
   *
   * @const {string} pkgdir
   */
  const pkgdir: string = fileURLToPath(dir).replace(/\/$/, '') + pathe.sep

  /**
   * URL of relevant `package.json` file.
   *
   * @const {URL} pkg
   */
  const pkg: URL = new URL('package.json', pathToFileURL(pkgdir))

  /**
   * Subpaths defined in {@linkcode context}.
   *
   * @const {string[]} keys
   */
  const keys: string[] = getSubpaths(context, id.internal, pkg, parent)

  /**
   * Subpath defined in {@linkcode context} that maps to {@linkcode specifier}.
   *
   * @var {Nullable<string>} key
   */
  let key: Nullable<string> = null

  /**
   * Subpath without entry prefix ({@linkcode key}).
   *
   * @var {string} base
   */
  let base: string = ''

  // match specifier to subpath defined in context
  for (const pkgsubpath of keys) {
    /**
     * Index of {@linkcode PATTERN_CHARACTER} in {@linkcode pkgsubpath}.
     *
     * @const {number} pattern
     */
    const pattern: number = pkgsubpath.indexOf(PATTERN_CHARACTER)

    // no pattern character => subpath must be exact match
    if (pattern === -1 && pkgsubpath === id.path) {
      key = pkgsubpath
      break
    }

    // pattern character => try finding best match for subpath
    if (pattern !== -1 && id.path.startsWith(pkgsubpath.slice(0, pattern))) {
      /**
       * Everything after pattern character (`*`) in {@linkcode pkgsubpath}.
       *
       * @const {string} trailer
       */
      const trailer: string = pkgsubpath.slice(pattern + 1)

      // best match found => reset key and base of subpath
      if (
        id.path.length >= pkgsubpath.length &&
        id.path.endsWith(trailer) &&
        compareSubpaths(key ?? '', pkgsubpath) === CompareResult.GREATER_THAN &&
        pkgsubpath.lastIndexOf(PATTERN_CHARACTER) === pattern
      ) {
        key = pkgsubpath
        base = id.path.slice(pattern, id.path.length - trailer.length)
      }
    }
  }

  // throw if defined subpath was not found
  if (key === null) {
    let { parent } = options

    // ensure parent is a path
    parent = fileURLToPath(parent)

    throw internal
      ? new ERR_PACKAGE_IMPORT_NOT_DEFINED(id.path, parent, pkgdir)
      : new ERR_PACKAGE_PATH_NOT_EXPORTED(pkgdir, id.path, parent)
  }

  /**
   * Finds the package target string specified by {@linkcode key}.
   *
   * @param {Exports | undefined} data - Initial package target
   * @return {Nullable<string>} Package target string or `null`
   * @throws {NodeError<Error | TypeError>}
   */
  const findPackageTarget = (data: Exports | undefined): Nullable<string> => {
    /**
     * Package target.
     *
     * @var {Nullable<string>} target
     */
    let target: Nullable<string> = null

    switch (true) {
      case isNIL(data):
        target = null
        break
      case Array.isArray(data):
        /**
         * Possible package target search error.
         *
         * @var {NodeError | undefined} error
         */
        let error: NodeError | undefined

        // try finding package target based on first match in search context
        for (const item of data as string[]) {
          try {
            target = findPackageTarget(item)
          } catch (e: unknown) {
            error = e as NodeError

            /* c8 ignore next */
            if (error.code !== ErrorCode.ERR_INVALID_PACKAGE_TARGET) throw error

            continue
          }

          // stop search attempts if target was found
          if (target) {
            error = undefined
            break
          }
        }

        // throw if error was encountered
        if (error) throw error

        break
      case typeof data === 'object':
        data = data as Record<string, Exports>

        // try finding package target based on condition
        for (const property of Object.getOwnPropertyNames(data)) {
          if (isArrayIndex(property)) {
            throw new ERR_INVALID_PACKAGE_CONFIG(
              fileURLToPath(pkg),
              fileURLToPath(parent),
              '"exports" cannot contain numeric property keys'
            )
          }

          // check conditions
          if (property === condition || new Set(conditions).has(property)) {
            target = findPackageTarget(data[property])
            if (target) break
          }
        }

        break
      case typeof data === 'string':
        target = data as string

        switch (true) {
          case internal && PACKAGE_NAME_REGEX.test(target):
            break
          case target.startsWith('.' + pathe.sep):
            // check target for invalid segments
            if (invalidSegmentRegex().test(target.slice(2))) {
              if (invalidSegmentRegex('deprecated').test(target.slice(2))) {
                throw new ERR_INVALID_PACKAGE_TARGET(
                  fileURLToPath(dir),
                  key!,
                  target,
                  internal,
                  fileURLToPath(parent)
                )
              }
            }

            break
          default:
            throw new ERR_INVALID_PACKAGE_TARGET(
              fileURLToPath(dir),
              key!,
              target,
              internal,
              fileURLToPath(parent)
            )
        }

        break
      default:
        throw new ERR_INVALID_PACKAGE_TARGET(
          fileURLToPath(dir),
          key!,
          data,
          internal,
          fileURLToPath(parent)
        )
    }

    return target
  }

  // convert exports to object if using exports main sugar
  if (!internal && isExportsSugar(context, pkg, parent)) {
    context = { '.': context } as Record<string, Exports>
  }

  return {
    base,
    internal,
    key,
    raw: id.path,
    specifier: id.raw,
    target: findPackageTarget((context as Record<string, Exports>)[key])
  }
}

export default parseSubpath
