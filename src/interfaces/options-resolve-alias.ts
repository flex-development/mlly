/**
 * @file Interfaces - ResolveAliasOptions
 * @module mlly/interfaces/ResolveAliasOptions
 */

import type { ModuleId } from '#src/types'
import type { MapLike, OneOrMany } from '@flex-development/tutils'
import type ResolveModuleOptions from './options-resolve-module'

/**
 * Path alias resolution options.
 *
 * @see {@linkcode ModuleId}
 *
 * @extends {ResolveModuleOptions}
 */
interface ResolveAliasOptions extends ResolveModuleOptions {
  /**
   * Return resolved module URL as absolute specifier (a [`file:` URL][1]).
   *
   * If `false`, return resolved module URL as bare or relative specifier.
   *
   * [1]: https://nodejs.org/api/esm.html#file-urls
   *
   * @see https://nodejs.org/api/esm.html#terminology
   *
   * @default true
   */
  absolute?: boolean | undefined

  /**
   * Path mappings.
   *
   * **Note**: Paths should be relative to {@linkcode cwd}.
   *
   * @default {}
   */
  aliases?: MapLike<OneOrMany<string>> | undefined

  /**
   * Directory to resolve non-absolute modules from.
   *
   * @default pathToFileURL('.')
   */
  cwd?: ModuleId | undefined

  /**
   * Id of module to resolve from.
   *
   * **Note**: Should be an absolute path or [`file:` URL][1].
   *
   * [1]: https://nodejs.org/api/esm.html#file-urls
   *
   * @default import.meta.url
   */
  parent?: ModuleId | undefined
}

export type { ResolveAliasOptions as default }
