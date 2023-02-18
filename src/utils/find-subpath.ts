/**
 * @file findSubpath
 * @module mlly/utils/findSubpath
 */

import type { FindSubpathOptions } from '#src/interfaces'
import getSubpaths from '#src/internal/get-subpaths'
import validateBoolean from '#src/internal/validate-boolean'
import validateSet from '#src/internal/validate-set'
import validateString from '#src/internal/validate-string'
import validateURLString from '#src/internal/validate-url-string'
import type { NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import type { Exports, Imports } from '@flex-development/pkg-types'
import { isNIL, type Nullable } from '@flex-development/tutils'
import { URL } from 'node:url'
import compareSubpaths from './compare-subpaths'
import CONDITIONS from './conditions'
import isExportsSugar from './is-exports-sugar'
import PATTERN_CHARACTER from './pattern-character'
import toURL from './to-url'

/**
 * Finds the subpath defined in `context`, a `package.json` [`exports`][1] or
 * [`imports`][2] field, that maps to the given package `target`.
 *
 * Supports extensionless targets and targets without explicit `'/index'` usage.
 * Returns `null` if a subpath is not found.
 *
 * [1]: https://nodejs.org/api/packages.html#exports
 * [2]: https://nodejs.org/api/packages.html#imports
 *
 * @see {@linkcode Exports}
 * @see {@linkcode FindSubpathOptions}
 * @see {@linkcode Imports}
 * @see https://nodejs.org/api/packages.html#subpath-exports
 * @see https://nodejs.org/api/packages.html#subpath-imports
 *
 * @param {string} target - Package target to find in `context`
 * @param {Exports | Imports | undefined} context - Package context
 * @param {FindSubpathOptions} options - Search options
 * @return {Nullable<string>} Subpath defined in `context` or `null`
 * @throws {NodeError<Error | TypeError>}
 */
const findSubpath = (
  target: string,
  context: Exports | Imports | undefined,
  options: FindSubpathOptions
): Nullable<string> => {
  const {
    condition = 'default',
    conditions = CONDITIONS,
    dir,
    internal = false,
    parent
  } = options

  // exit early if context is nil
  if (isNIL(context)) return null

  // ensure target is a string
  validateString(target, 'target')

  // exit early if target is an exactish match
  if (typeof context === 'string') {
    if (target === context || target === pathe.changeExt(context, '')) {
      return '.'
    }
  }

  // ensure option schemas
  validateString(condition, 'options.condition')
  validateSet(conditions, 'options.conditions')
  validateURLString(dir, 'options.dir')
  validateBoolean(internal, 'options.internal')
  validateURLString(parent, 'options.parent')

  /**
   * Finds the subpath defined in `context`, a `package.json` [`exports`][1] or
   * [`imports`][2] field, that maps to the given package `target`.
   *
   * Returns `null` if a subpath is not found.
   *
   * [1]: https://nodejs.org/api/packages.html#exports
   * [2]: https://nodejs.org/api/packages.html#imports
   *
   * @param {string} target - Package target to find in `context`
   * @param {Exports | Imports | undefined} context - Package context
   * @param {string} [key='.'] - Subpath in `context` being checked
   * @return {Nullable<string>} Subpath defined in `context` or `null`
   */
  const find = (
    target: string,
    context: Exports | Imports | undefined,
    key: string = '.'
  ): Nullable<string> => {
    /**
     * Subpath defined in {@linkcode context} that maps to {@linkcode target}.
     *
     * @var {Nullable<string>} subpath
     */
    let subpath: Nullable<string> = null

    // match target to subpath
    switch (true) {
      case !isNIL(context) && typeof context === 'object':
      case typeof context === 'string':
        /**
         * URL of directory containing relevant `package.json` file.
         *
         * @const {string} pkgdir
         */
        const pkgdir: string = toURL(dir).href.replace(/\/$/, '') + pathe.sep

        /**
         * URL of relevant `package.json` file.
         *
         * @const {URL} pkg
         */
        const pkg: URL = new URL('package.json', pkgdir)

        // convert package context to object if using exports sugar
        if (!internal && isExportsSugar(context, pkg, parent)) {
          context = { [key]: context } as Record<string, Exports>
        }

        // context is now an object
        context = context as Record<string, Exports>

        /**
         * Subpaths defined in {@linkcode context}.
         *
         * **Note**: Sorted from least to greatest.
         *
         * @see {@linkcode compareSubpaths}
         *
         * @const {string[]} keys
         */
        const subpaths: string[] = getSubpaths(
          context,
          internal,
          pkg,
          parent
        ).sort((s1, s2) => compareSubpaths(s1, s2) * -1)

        // match target to subpath defined in context
        for (const pkgsubpath of subpaths) {
          /**
           * Current package target being checked.
           *
           * @var {Exports} tar
           */
          let tar: Exports = context[pkgsubpath]!

          // find subpath
          switch (true) {
            case Array.isArray(tar):
              tar = tar as string[]

              // try matching target based first match in target array
              for (const item of tar) {
                subpath = find(target, item, pkgsubpath)
                if (subpath) break
              }

              break
            case typeof tar === 'object' && !isNIL(tar):
              tar = tar as Record<string, Exports>

              // try matching target based on export conditions
              for (const prop of Object.getOwnPropertyNames(tar)) {
                if (prop === condition || conditions.has(prop)) {
                  subpath = find(target, tar[prop], pkgsubpath)
                  if (subpath) break
                }
              }

              break
            case typeof tar === 'string':
              tar = tar as string

              /**
               * {@linkcode tar} without file extension.
               *
               * @const {string} tar_ne
               */
              const tar_ne: string = pathe.changeExt(tar, '')

              /**
               * {@linkcode tar_ne} without `'/index'`.
               *
               * @const {string} tar_ni
               */
              const tar_ni: string = tar_ne.replace(/\/index$/, '')

              /**
               * Index of {@linkcode PATTERN_CHARACTER} in {@linkcode tar}.
               *
               * @const {number} pattern
               */
              const pattern: number = tar.indexOf(PATTERN_CHARACTER)

              switch (true) {
                // target is an exactish match
                case target === tar:
                case target === tar_ne:
                case target === tar_ni && tar_ne.endsWith('/index'):
                case pattern === -1 && (target === tar || target === tar_ne):
                  subpath = pkgsubpath
                  break
                // pattern character => try finding best match for target
                case pattern !== -1 && target.startsWith(tar.slice(0, pattern)):
                  /**
                   * Boolean indicating if {@linkcode target} ends with the
                   * characters after the pattern character (`*`) in
                   * {@linkcode tar}.
                   *
                   * @const {boolean} match
                   */
                  const match: boolean =
                    target.length >= tar.length &&
                    tar.lastIndexOf(PATTERN_CHARACTER) === pattern &&
                    (target.endsWith(tar.slice(pattern + 1)) ||
                      target.endsWith(tar_ne.slice(pattern + 1)))

                  // set subpath if match was found
                  if (match) subpath = pkgsubpath

                  break
              }

              break
          }

          // stop searching for subpath if subpath has been found
          if (subpath) break
        }

        break
      default:
        break
    }

    return subpath
  }

  return find(target, context)
}

export default findSubpath
