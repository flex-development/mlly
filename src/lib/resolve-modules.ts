/**
 * @file resolveModules
 * @module mlly/lib/resolveModules
 */

import { SpecifierKind } from '#src/enums'
import type { ResolveOptions } from '#src/interfaces'
import type { ModuleSpecifierType } from '#src/types'
import pathe from '@flex-development/pathe'
import extractStatements from './extract-statements'
import resolveModule from './resolve-module'

/**
 * Resolves all modules in `code`.
 *
 * @see {@linkcode ResolveOptions}
 * @see {@linkcode resolveModule}
 *
 * @async
 *
 * @param {string} code - Code containing module specifiers
 * @param {ResolveOptions} [options={}] - Resolve options
 * @return {Promise<string>} `code` with modules resolved
 */
const resolveModules = async (
  code: string,
  options: ResolveOptions = {}
): Promise<string> => {
  for (const statement of extractStatements(code)) {
    // do nothing if statement does not have specifier
    if (!statement.specifier) continue

    // ignore statements with dynamic specifiers
    if (statement.specifier_kind === SpecifierKind.DYNAMIC) continue

    /**
     * Determines a module specifier type for `resolved`.
     *
     * @param {string} resolved - Resolved module
     * @return {ModuleSpecifierType} Module specifier type for `resolved`
     */
    const type = (resolved: string): ModuleSpecifierType => {
      return pathe.isAbsolute(statement.specifier!) ||
        statement.specifier!.startsWith('file:')
        ? 'absolute'
        : /\/node_modules\//.test(resolved)
        ? 'bare'
        : 'relative'
    }

    code = code.replace(
      statement.code,
      statement.code.replace(
        statement.specifier,
        await resolveModule(statement.specifier, {
          ...options,
          type: options.type ?? type
        })
      )
    )
  }

  return code
}

export default resolveModules
