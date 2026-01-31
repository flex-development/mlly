/**
 * @file Interfaces - ResolveModuleOptions
 * @module mlly/interfaces/ResolveModuleOptions
 */

import type {
  Aliases,
  ChangeExtFn,
  Condition,
  FileSystem,
  List,
  MainField,
  ModuleId
} from '@flex-development/mlly'

/**
 * Module resolution options.
 */
interface ResolveModuleOptions {
  /**
   * The path mappings dictionary.
   *
   * > 👉 **Note**: Paths should be relative to {@linkcode cwd}.
   *
   * @see {@linkcode Aliases}
   */
  aliases?: Aliases | null | undefined

  /**
   * The list of export/import conditions.
   *
   * > 👉 **Note**: Should be sorted by priority.
   *
   * @see {@linkcode Condition}
   * @see {@linkcode List}
   * @see https://nodejs.org/api/packages.html#conditional-exports
   *
   * @default defaultConditions
   */
  conditions?: List<Condition> | null | undefined

  /**
   * The URL of the directory to resolve path aliases from.
   *
   * @see {@linkcode ModuleId}
   *
   * @default cwd()
   */
  cwd?: ModuleId | null | undefined

  /**
   * A replacement file extension or a function that returns a file extension.
   *
   * An empty string (`''`) or `null` will remove a file extension.
   *
   * @see {@linkcode ChangeExtFn}
   */
  ext?: ChangeExtFn | string | null | undefined

  /**
   * The module extensions to probe for.
   *
   * > 👉 **Note**: Should be sorted by priority.
   *
   * @default defaultExtensions
   */
  extensions?: Set<string> | string[] | null | undefined

  /**
   * The file system API.
   *
   * @see {@linkcode FileSystem}
   */
  fs?: FileSystem | null | undefined

  /**
   * The list of legacy `main` fields.
   *
   * > 👉 **Note**: Should be sorted by priority.
   *
   * @see {@linkcode List}
   * @see {@linkcode MainField}
   *
   * @default defaultMainFields
   */
  mainFields?: List<MainField> | null | undefined

  /**
   * Whether to keep symlinks instead of resolving them.
   */
  preserveSymlinks?: boolean | null | undefined
}

export type { ResolveModuleOptions as default }
