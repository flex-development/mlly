/**
 * @file Interfaces - ResolveAliasOptions
 * @module mlly/interfaces/ResolveAliasOptions
 */

import type { Aliases, ModuleId } from '@flex-development/mlly'

/**
 * Options for path alias resolution.
 */
interface ResolveAliasOptions {
  /**
   * Whether the resolved specifier should be absolute.
   *
   * If `true`, the resolved specifier will be a [`file:` URL][file-url].
   *
   * [file-url]: https://nodejs.org/api/esm.html#file-urls
   *
   * @see https://nodejs.org/api/esm.html#terminology
   */
  absolute?: boolean | null | undefined

  /**
   * The path mappings dictionary.
   *
   * > 👉 **Note**: Paths should be relative to {@linkcode cwd}.
   *
   * @see {@linkcode Aliases}
   */
  aliases?: Aliases | null | undefined

  /**
   * The URL of the directory to resolve non-absolute modules from.
   *
   * @see {@linkcode ModuleId}
   *
   * @default cwd()
   */
  cwd?: ModuleId | null | undefined

  /**
   * The URL of the parent module.
   *
   * @see {@linkcode ModuleId}
   */
  parent?: ModuleId | null | undefined
}

export type { ResolveAliasOptions as default }
