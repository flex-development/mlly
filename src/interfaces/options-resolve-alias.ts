/**
 * @file Interfaces - ResolveAliasOptions
 * @module mlly/interfaces/ResolveAliasOptions
 */

import type { Aliases, ModuleId } from '@flex-development/mlly'

/**
 * Path alias resolution options.
 */
interface ResolveAliasOptions {
  /**
   * Return resolved module URL as absolute specifier (a [`file:` URL][1]).
   *
   * [1]: https://nodejs.org/api/esm.html#file-urls
   *
   * @see https://nodejs.org/api/esm.html#terminology
   */
  absolute?: boolean | null | undefined

  /**
   * Path mappings.
   *
   * > 👉 **Note**: Paths should be relative to {@linkcode cwd}.
   *
   * @see {@linkcode Aliases}
   */
  aliases?: Aliases | null | undefined

  /**
   * URL of directory to resolve non-absolute modules from.
   *
   * @see {@linkcode ModuleId}
   *
   * @default cwd()
   */
  cwd?: ModuleId | null | undefined

  /**
   * URL of parent module.
   *
   * @see {@linkcode ModuleId}
   */
  parent?: ModuleId | null | undefined
}

export type { ResolveAliasOptions as default }
