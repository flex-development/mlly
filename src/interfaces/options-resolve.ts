/**
 * @file Interfaces - ResolveOptions
 * @module mlly/interfaces/ResolveOptions
 */

import type { Ext, SpecifierType } from '#src/types'
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
  conditions?: Set<string> | string[] | readonly string[]

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

  /**
   * Module extensions to probe for.
   *
   * **Note**: Should be sorted by priority.
   *
   * @default RESOLVE_EXTENSIONS
   */
  extensions?: string[] | readonly string[]

  /**
   * Parent module URL or path to resolve from.
   *
   * @default import.meta.url
   */
  parent?: URL | string

  /**
   * Keep symlinks instead of resolving them.
   *
   * @default false
   */
  preserveSymlinks?: boolean

  /**
   * Module specifier type or a function to determine module specifier type.
   *
   * @see {@linkcode SpecifierType}
   *
   * @default 'absolute'
   */
  type?:
    | SpecifierType
    | ((resolved: string) => PromiseLike<SpecifierType> | SpecifierType)
}

export type { ResolveOptions as default }
