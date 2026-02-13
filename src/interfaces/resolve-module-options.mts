/**
 * @file Interfaces - ResolveModuleOptions
 * @module mlly/interfaces/ResolveModuleOptions
 */

import type {
  Aliases,
  Condition,
  ExtensionRewrites,
  FileSystem,
  GetNewExtension,
  List,
  MainField,
  ModuleId
} from '@flex-development/mlly'

/**
 * Options for module resolution.
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
   * The URL of the directory to resolve path {@linkcode aliases} from.
   *
   * @see {@linkcode ModuleId}
   *
   * @default cwd()
   */
  cwd?: ModuleId | null | undefined

  /**
   * A replacement file extension, a record of replacement file extensions,
   * or a function that returns a replacement file extension.
   *
   * > 👉 **Note**: Replacement file extensions are normalized and do not
   * > need to begin with a dot character (`'.'`); an empty string (`''`),
   * > `false`, or `null` will remove an extension.
   *
   * @see {@linkcode ExtensionRewrites}
   * @see {@linkcode GetNewExtension}
   */
  ext?: ExtensionRewrites | GetNewExtension | string | false | null | undefined

  /**
   * The module extensions to probe for.
   *
   * > 👉 **Note**: Should be sorted by priority.
   *
   * @see {@linkcode List}
   *
   * @default defaultExtensions
   */
  extensions?: List<string> | null | undefined

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
