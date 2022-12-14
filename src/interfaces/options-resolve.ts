/**
 * @file Interfaces - ResolveOptions
 * @module mlly/interfaces/ResolveOptions
 */

import type { ModuleSpecifierType } from '#src/types'
import type { Ext } from '@flex-development/pathe'
import type { EmptyString } from '@flex-development/tutils'
import type { URL } from 'node:url'

/**
 * Module resolution options.
 */
interface ResolveOptions {
  /**
   * Export conditions.
   *
   * **Note**: Should be sorted by priority.
   *
   * @see https://nodejs.org/api/packages.html#conditional-exports
   *
   * @default CONDITIONS
   */
  conditions?: Set<string> | string[] | readonly string[] | undefined

  /**
   * Remove or replace file extension.
   *
   * **Note**: {@linkcode type} must be set to `relative`.
   *
   * @see {@linkcode Ext}
   */
  ext?:
    | Ext
    | false
    | ((
        specifier: string,
        resolved: string
      ) => EmptyString | Ext | PromiseLike<EmptyString | Ext>)
    | undefined

  /**
   * Module extensions to probe for.
   *
   * **Note**: Should be sorted by priority.
   *
   * @default RESOLVE_EXTENSIONS
   */
  extensions?: string[] | readonly string[] | undefined

  /**
   * Parent module URL or path to resolve from.
   *
   * @default import.meta.url
   */
  parent?: URL | string | undefined

  /**
   * Keep symlinks instead of resolving them.
   *
   * @default false
   */
  preserveSymlinks?: boolean | undefined

  /**
   * Module specifier type or a function to determine module specifier type.
   *
   * @see {@linkcode ModuleSpecifierType}
   *
   * @default 'absolute'
   */
  type?:
    | ModuleSpecifierType
    | ((
        resolved: string
      ) => ModuleSpecifierType | PromiseLike<ModuleSpecifierType>)
    | undefined
}

export type { ResolveOptions as default }
