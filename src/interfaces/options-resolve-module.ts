/**
 * @file Interfaces - ResolveModuleOptions
 * @module mlly/interfaces/ResolveModuleOptions
 */

import type { ChangeExtFn, ModuleId } from '#src/types'
import type { Nilable } from '@flex-development/tutils'

/**
 * Module resolution options.
 *
 * @see {@linkcode ChangeExtFn}
 * @see {@linkcode ModuleId}
 */
interface ResolveModuleOptions {
  /**
   * Export condition to apply.
   *
   * @see https://nodejs.org/api/packages.html#conditional-exports
   *
   * @default 'default'
   */
  condition?: string | undefined

  /**
   * Export conditions.
   *
   * **Note**: Should be sorted by priority.
   *
   * @see https://nodejs.org/api/packages.html#conditional-exports
   *
   * @default CONDITIONS
   */
  conditions?: Set<string> | string[] | undefined

  /**
   * Replacement file extension or function that returns a file extension.
   *
   * An empty string (`''`) will remove a file extension; `null` or `undefined`
   * will skip extension replacement.
   *
   * @default undefined
   */
  ext?: ChangeExtFn | Nilable<string>

  /**
   * Module extensions to probe for.
   *
   * **Note**: Should be sorted by priority.
   *
   * @default RESOLVE_EXTENSIONS
   */
  extensions?: Set<string> | string[] | undefined

  /**
   * URL of module to resolve from.
   *
   * @see {@linkcode ModuleId}
   *
   * @default import.meta.url
   */
  parent?: ModuleId | undefined

  /**
   * Keep symlinks instead of resolving them.
   *
   * @default false
   */
  preserveSymlinks?: boolean | undefined
}

export type { ResolveModuleOptions as default }
