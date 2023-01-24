/**
 * @file Interfaces - FillModuleOptions
 * @module mlly/interfaces/FillModuleOptions
 */

import type { ChangeExtFn } from '#src/types'
import type ResolveModuleOptions from './options-resolve-module'

/**
 * Options for fully specifying modules.
 *
 * @see {@linkcode ChangeExtFn}
 * @see {@linkcode ResolveModuleOptions}
 * @see https://nodejs.org/api/esm.html#mandatory-file-extensions
 *
 * @extends {ResolveModuleOptions}
 */
interface FillModuleOptions extends ResolveModuleOptions {
  /**
   * File extension to add to absolute and relative specifiers or a function
   * that returns a file extension.
   */
  ext: ChangeExtFn<string> | string
}

export type { FillModuleOptions as default }
