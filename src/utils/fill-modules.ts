/**
 * @file fillModules
 * @module mlly/utils/fillModules
 */

import { SpecifierKind } from '#src/enums'
import type { FillModuleOptions } from '#src/interfaces'
import isFunction from '#src/internal/is-function'
import { ERR_UNKNOWN_FILE_EXTENSION } from '@flex-development/errnode'
import pathe, { type Ext } from '@flex-development/pathe'
import type { EmptyString } from '@flex-development/tutils'
import type { URL } from 'node:url'
import CONDITIONS from './conditions'
import extractStatements from './extract-statements'
import isAbsoluteSpecifier from './is-absolute-specifier'
import isBareSpecifier from './is-bare-specifier'
import resolveModule from './resolve-module'
import toBareSpecifier from './to-bare-specifier'
import toRelativeSpecifier from './to-relative-specifier'

/**
 * Ensures all absolute and relative module specifiers in the given piece of
 * source `code` are fully specified.
 *
 * Ignores specifiers that already have file extensions.
 *
 * @see {@linkcode FillModuleOptions}
 * @see https://nodejs.org/api/esm.html#mandatory-file-extensions
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @async
 *
 * @param {string} code - Code to evaluate
 * @param {FillModuleOptions} options - Module fill options
 * @return {Promise<string>} `code` with fully specified module specifiers
 */
const fillModules = async (
  code: string,
  options: FillModuleOptions
): Promise<string> => {
  const { conditions = CONDITIONS, ext, parent = import.meta.url } = options

  // ensure specifiers have file extensions
  for (const statement of extractStatements(code)) {
    // do nothing if statement does not have specifier
    if (!statement.specifier) continue

    // ignore statements with dynamic specifiers
    if (statement.specifier_kind === SpecifierKind.DYNAMIC) continue

    /**
     * Resolved module URL.
     *
     * @const {URL} url
     */
    const url: URL = await resolveModule(statement.specifier, {
      ...options,
      /**
       * Returns a replacement file extension for the given module `specifier`
       * **if it is non-bare and does not already have an extension**.
       *
       * Throws [`ERR_UNKNOWN_FILE_EXTENSION`][1] if the replacement extension
       * is `null`, `undefined`, an empty string, or a dot character (`'.'`).
       *
       * [1]: https://nodejs.org/api/errors.html#err_unknown_file_extension
       *
       * @async
       *
       * @param {string} specifier - Module specifier
       * @param {URL} url - Resolved module URL
       * @return {Promise<string | undefined>} New file extension or `undefined`
       */
      async ext(specifier: string, url: URL): Promise<string | undefined> {
        /**
         * Current file extension of {@linkcode specifier}.
         *
         * @const {EmptyString | Ext} extname
         */
        const extname: EmptyString | Ext = pathe.extname(specifier)

        // skip replacement for bare and already fully specified specifiers
        if (isBareSpecifier(specifier) || extname.length > 1) return undefined

        /**
         * Replacement file extension.
         *
         * @var {string} rext
         */
        const rext: string = isFunction(ext) ? await ext(specifier, url) : ext

        // ensure replacement extension is non-empty and non-dot ('.')
        if (!(rext && rext.trim().length > (rext.startsWith('.') ? 1 : 0))) {
          throw new ERR_UNKNOWN_FILE_EXTENSION(rext, specifier)
        }

        return rext
      }
    })

    // replace original module specifier
    code = code.replace(
      statement.code,
      statement.code.replace(
        statement.specifier,
        // convert module url back to absolute, bare, or relative specifier
        statement.specifier.startsWith('#')
          ? statement.specifier
          : isAbsoluteSpecifier(statement.specifier)
          ? url.href
          : isBareSpecifier(statement.specifier)
          ? toBareSpecifier(url, parent, conditions)
          : toRelativeSpecifier(url, parent)
      )
    )
  }

  return code
}

export default fillModules
