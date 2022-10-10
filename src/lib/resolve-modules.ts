/**
 * @file resolveModules
 * @module mlly/lib/resolveModules
 */

import type { ResolveOptions as Options } from '#src/interfaces'
import type { SpecifierType } from '#src/types'
import upath from 'upath'
import extractStatements from './extract-statements'
import resolveModule from './resolve-module'

/**
 * Resolves all modules in `code`.
 *
 * @see [`resolveModule`](./resolve-module.ts)
 *
 * @async
 *
 * @param {string} code - Code containing module specifiers
 * @param {Omit<Options, 'type'>} [options={}] - Resolve options
 * @return {Promise<string>} `code` with modules resolved
 */
const resolveModules = async (
  code: string,
  options: Options = {}
): Promise<string> => {
  for (const statement of extractStatements(code)) {
    if (!statement.specifier) continue

    /**
     * Determines a module specifier type for `resolved`.
     *
     * @param {string} resolved - Resolved module
     * @return {SpecifierType} Module specifier type for `resolved`
     */
    const type = (resolved: string): SpecifierType => {
      return upath.isAbsolute(statement.specifier!) ||
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
