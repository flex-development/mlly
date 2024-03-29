/**
 * @file resolveModules
 * @module mlly/utils/resolveModules
 */

import { SpecifierSyntaxKind } from '#src/enums'
import type { ResolveModuleOptions } from '#src/interfaces'
import { regexp } from '@flex-development/tutils'
import type { URL } from 'node:url'
import extractStatements from './extract-statements'
import resolveModule from './resolve-module'

/**
 * Converts all module specifiers in `code` to absolute specifiers.
 *
 * ::: info
 * Useful for converting code to [`data:` URLs][1].
 * :::
 *
 * [1]: https://nodejs.org/api/esm.html#data-imports
 *
 * @see {@linkcode ResolveModuleOptions}
 * @see https://nodejs.org/api/esm.html#terminology
 *
 * @async
 *
 * @param {string} code - Code to evaluate
 * @param {ResolveModuleOptions} [options={}] - Module resolution options
 * @return {Promise<string>} `code` with module specifiers fully resolved
 */
const resolveModules = async (
  code: string,
  options: ResolveModuleOptions = {}
): Promise<string> => {
  for (const statement of extractStatements(code)) {
    if (statement.specifier) {
      if (statement.specifier_syntax !== SpecifierSyntaxKind.DYNAMIC) {
        /**
         * Resolved module URL.
         *
         * @const {URL} url
         */
        const url: URL = await resolveModule(statement.specifier, options)

        // replace original specifier
        code = code.replace(
          statement.code,
          statement.code.replace(
            new RegExp(`(?<=["'])${regexp(statement.specifier)}(?=["'])`),
            url.href
          )
        )
      }
    }
  }

  return code
}

export default resolveModules
