/**
 * @file fillModules
 * @module mlly/utils/fillModules
 */

import { SpecifierSyntaxKind } from '#src/enums'
import type { FillModuleOptions } from '#src/interfaces'
import validateArraySet from '#src/internal/validate-array-set'
import validateURLString from '#src/internal/validate-url-string'
import {
  ERR_UNKNOWN_FILE_EXTENSION,
  type NodeError
} from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import {
  DOT,
  isFunction,
  regexp,
  trim,
  type Optional
} from '@flex-development/tutils'
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
 * @throws {NodeError<TypeError>}
 */
const fillModules = async (
  code: string,
  options: FillModuleOptions
): Promise<string> => {
  const { conditions = CONDITIONS, ext, parent = import.meta.url } = options

  // validate options
  validateArraySet(conditions, 'options.conditions')
  validateURLString(parent, 'options.parent')

  // ensure specifiers have file extensions
  for (const statement of extractStatements(code)) {
    if (statement.specifier) {
      if (statement.specifier_syntax !== SpecifierSyntaxKind.DYNAMIC) {
        /**
         * Resolved module URL.
         *
         * @const {URL} url
         */
        const url: URL = await resolveModule(statement.specifier, {
          ...options,
          /**
           * Returns a replacement file extension for the given `specifier` if
           * it is non-bare and does not already have an extension.
           *
           * Throws [`ERR_UNKNOWN_FILE_EXTENSION`][1] if the new extension is
           * `null`, `undefined`, an empty string, or a dot character (`'.'`).
           *
           * [1]: https://nodejs.org/api/errors.html#err_unknown_file_extension
           *
           * @async
           *
           * @param {string} specifier - Module specifier
           * @param {URL} url - Resolved module URL
           * @return {Promise<Optional<string>>} New file extension
           */
          async ext(specifier: string, url: URL): Promise<Optional<string>> {
            // skip replacement for bare specifiers
            if (isBareSpecifier(specifier)) return void 0

            // skip replacement for specifiers that are already fully specified
            if (pathe.extname(specifier) === pathe.extname(url.href)) {
              return void 0
            }

            /**
             * Replacement file extension.
             *
             * @var {string} rext
             */
            const rext: string = isFunction(ext)
              ? await ext(specifier, url)
              : ext

            // ensure replacement extension is non-empty and non-dot ('.')
            if (!(rext && trim(rext).length > (rext.startsWith(DOT) ? 1 : 0))) {
              throw new ERR_UNKNOWN_FILE_EXTENSION(rext, specifier)
            }

            return rext
          }
        })

        // replace original module specifier
        code = code.replace(
          statement.code,
          statement.code.replace(
            new RegExp(`(?<=["'])${regexp(statement.specifier)}(?=["'])`),
            // convert module url back to absolute, bare, or relative specifier
            statement.specifier.startsWith('#')
              ? statement.specifier
              : isAbsoluteSpecifier(statement.specifier)
              ? url.href
              : isBareSpecifier(statement.specifier)
              ? toBareSpecifier(url, parent, new Set(conditions))
              : toRelativeSpecifier(url, parent)
          )
        )
      }
    }
  }

  return code
}

export default fillModules
