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
import validateString from '#src/internal/validate-string'
import validateURLString from '#src/internal/validate-url-string'
import {
  ERR_PACKAGE_IMPORT_NOT_DEFINED,
  ERR_PACKAGE_PATH_NOT_EXPORTED,
  type NodeError
} from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import type { Exports, Imports } from '@flex-development/pkg-types'
import { CompareResult, type Nullable } from '@flex-development/tutils'
import { URL, fileURLToPath, pathToFileURL } from 'node:url'
import compareSubpaths from './compare-subpaths'
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
 * @throws {NodeError<Error | TypeError>} If `specifier` is not a string or the
 * subpath defined in `specifier` is not defined in `context`
 */
const parseSubpath = (
  specifier: string,
  context: Exports | Imports | undefined,
  options: ParseSubpathOptions
): ParsedSubpath => {
  const { dir, internal = specifier.startsWith('#'), parent } = options

  // ensure specifier is a string
  validateString(specifier, 'specifier')

  // ensure dir is an instance of URL or a string
  validateURLString(dir, 'options.dir')

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

    // ensure parent is an instance of URL or a string
    validateURLString(parent, 'options.parent')

    // ensure parent is a path
    parent = fileURLToPath(parent)

    throw internal
      ? new ERR_PACKAGE_IMPORT_NOT_DEFINED(id.path, parent, pkgdir)
      : new ERR_PACKAGE_PATH_NOT_EXPORTED(pkgdir, id.path, parent)
  }

  return { base, internal, key, raw: id.path, specifier: id.raw }
}

export default parseSubpath
