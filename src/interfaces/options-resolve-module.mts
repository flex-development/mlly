/**
 * @file Interfaces - ResolveModuleOptions
 * @module mlly/interfaces/ResolveModuleOptions
 */

import type {
  Aliases,
  ChangeExtFn,
  FileSystem,
  MainField,
  ModuleId
} from '@flex-development/mlly'
import type { Condition } from '@flex-development/pkg-types'

/**
 * Module resolution options.
 */
interface ResolveModuleOptions {
  /**
   * Path mappings.
   *
   * > 👉 **Note**: Paths should be relative to {@linkcode cwd}.
   *
   * @see {@linkcode Aliases}
   */
  aliases?: Aliases | null | undefined

  /**
   * List of export/import conditions.
   *
   * > 👉 **Note**: Should be sorted by priority.
   *
   * @see {@linkcode Condition}
   * @see https://nodejs.org/api/packages.html#conditional-exports
   *
   * @default defaultConditions
   */
  conditions?: Condition[] | Set<Condition> | null | undefined

  /**
   * URL of directory to resolve path aliases from.
   *
   * @see {@linkcode ModuleId}
   *
   * @default cwd()
   */
  cwd?: ModuleId | null | undefined

  /**
   * Replacement file extension or function that returns a file extension.
   *
   * An empty string (`''`) or `null` will remove a file extension.
   *
   * @see {@linkcode ChangeExtFn}
   */
  ext?: ChangeExtFn | string | null | undefined

  /**
   * Module extensions to probe for.
   *
   * > 👉 **Note**: Should be sorted by priority.
   *
   * @default defaultExtensions
   */
  extensions?: Set<string> | string[] | null | undefined

  /**
   * File system API.
   *
   * @see {@linkcode FileSystem}
   */
  fs?: FileSystem | null | undefined

  /**
   * List of legacy `main` fields.
   *
   * > 👉 **Note**: Should be sorted by priority.
   *
   * @see {@linkcode MainField}
   *
   * @default defaultMainFields
   */
  mainFields?: MainField[] | Set<MainField> | null | undefined

  /**
   * Keep symlinks instead of resolving them.
   */
  preserveSymlinks?: boolean | null | undefined
}

export type { ResolveModuleOptions as default }
