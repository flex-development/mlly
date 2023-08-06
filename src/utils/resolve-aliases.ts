/**
 * @file resolveAliases
 * @module mlly/utils/resolveAliases
 */

import { SpecifierSyntaxKind } from '#src/enums'
import type { ResolveAliasOptions } from '#src/interfaces'
import { regexp } from '@flex-development/tutils'
import extractStatements from './extract-statements'
import resolveAlias from './resolve-alias'

/**
 * Resolves path aliases in the given piece of source `code`.
 *
 * @see {@linkcode ResolveAliasOptions}
 * @see {@linkcode resolveAlias}
 *
 * @async
 *
 * @param {string} code - Code to evaluate
 * @param {ResolveAliasOptions} [options={}] - Resolve alias options
 * @return {Promise<string>} `code` unmodified or with path aliases resolved
 */
const resolveAliases = async (
  code: string,
  options: ResolveAliasOptions = {}
): Promise<string> => {
  for (const statement of extractStatements(code)) {
    if (statement.specifier) {
      if (statement.specifier_syntax !== SpecifierSyntaxKind.DYNAMIC) {
        /**
         * Resolved module specifier.
         *
         * @const {string} specifier
         */
        const specifier: string = await resolveAlias(
          statement.specifier,
          options
        )

        // replace path alias
        if (specifier !== statement.specifier) {
          code = code.replace(
            statement.code,
            statement.code.replace(
              new RegExp(`(?<=["'])${regexp(statement.specifier)}(?=["'])`),
              specifier
            )
          )
        }
      }
    }
  }

  return code
}

export default resolveAliases
