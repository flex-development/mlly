/**
 * @file Internals - getCompilerOptions
 * @module mlly/internal/getCompilerOptions
 */

import pathe from '@flex-development/pathe'
import type { CompilerOptions } from '@flex-development/tsconfig-types'
import { loadTsconfig } from 'tsconfig-paths/lib/tsconfig-loader'

/**
 * Retrieves TypeScript compiler options from `path`.
 *
 * Supports [`extends`][1].
 *
 * [1]: https://typescriptlang.org/tsconfig#extends
 *
 * @internal
 *
 * @param {string} [path=pathe.resolve('tsconfig.json')] - Tsconfig path
 * @param {(path: string) => boolean} [exists] - File existence checker
 * @param {(filename: string) => string} [read] - File content reader
 * @return {CompilerOptions} User compiler options
 */
const getCompilerOptions = (
  path: string = pathe.resolve('tsconfig.json'),
  exists?: (path: string) => boolean,
  read?: (filename: string) => string
): CompilerOptions => {
  /**
   * Tsconfig object.
   *
   * @const {{ compilerOptions?: CompilerOptions } | undefined} t
   */
  const t: { compilerOptions?: CompilerOptions } | undefined = loadTsconfig(
    path,
    exists,
    read
  )

  return !t?.compilerOptions ? {} : t.compilerOptions
}

export default getCompilerOptions
