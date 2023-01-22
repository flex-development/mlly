/**
 * @file Interfaces - FindSubpathOptions
 * @module mlly/interfaces/FindSubpathOptions
 */

import type { ModuleId } from '#src/types'

/**
 * Subpath search options.
 *
 * @see {@linkcode ModuleId}
 */
interface FindSubpathOptions {
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
  conditions?: Set<string> | undefined

  /**
   * URL of directory containing relevant `package.json` file.
   */
  dir: ModuleId

  /**
   * Package [`imports`][1] hint.
   *
   * [1]: https://nodejs.org/api/packages.html#imports
   *
   * @default false
   */
  internal?: boolean | undefined

  /**
   * URL of module to resolve from.
   *
   * **Note**: Used for error reporting only.
   */
  parent: ModuleId
}

export type { FindSubpathOptions as default }
