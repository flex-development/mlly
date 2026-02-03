/**
 * @file Interfaces - Realpath
 * @module mlly/interfaces/Realpath
 */

import type { Awaitable, ModuleId } from '@flex-development/mlly'

/**
 * Compute a canonical pathname by resolving `.`, `..`, and symbolic links.
 *
 * > 👉 **Note**: A canonical pathname is not necessarily unique.
 * > Hard links and bind mounts can expose an entity through many pathnames.
 *
 * @see {@linkcode Awaitable}
 *
 * @template {Awaitable<string>} [T]
 *  The canonical pathname
 */
interface Realpath<T extends Awaitable<string> = Awaitable<string>> {
  /**
   * @see {@linkcode ModuleId}
   *
   * @this {unknown}
   *
   * @param {ModuleId} id
   *  The module id
   * @return {T}
   *  The canonical pathname
   */
  (id: ModuleId): T
}

export type { Realpath as default }
