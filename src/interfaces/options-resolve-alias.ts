/**
 * @file Interfaces - ResolveAliasOptions
 * @module mlly/interfaces/ResolveAliasOptions
 */

import type { ModuleId } from '#src/types'
import type { MapLike, OneOrMany, Optional } from '@flex-development/tutils'
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
  absolute?: Optional<boolean>

  /**
   * Path mappings.
   *
   * **Note**: Paths should be relative to {@linkcode cwd}.
   *
   * @default {}
   */
  aliases?: Optional<MapLike<OneOrMany<string>>>

  /**
   * Directory to resolve non-absolute modules from.
   *
   * @default pathToFileURL('.')
   */
  cwd?: Optional<ModuleId>

  /**
   * Id of module to resolve from.
   *
   * **Note**: Should be an absolute path or [`file:` URL][1].
   *
   * [1]: https://nodejs.org/api/esm.html#file-urls
   *
   * @default import.meta.url
   */
  parent?: Optional<ModuleId>
}

export type { ResolveAliasOptions as default }
