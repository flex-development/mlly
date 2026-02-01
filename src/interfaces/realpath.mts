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
 */
interface Realpath {
  /**
   * @see {@linkcode Awaitable}
   * @see {@linkcode ModuleId}
   *
   * @this {void}
   *
   * @param {ModuleId} id
   *  The module id
   * @return {Awaitable<string>}
   *  The canonical pathname
   */
  (this: void, id: ModuleId): Awaitable<string>
}

export type { Realpath as default }
