/**
 * @file Interfaces - ParseSubpathOptions
 * @module mlly/interfaces/ParseSubpathOptions
 */

import type { ModuleId } from '#src/types'

/**
 * Subpath parsing options.
 *
 * @see {@linkcode ModuleId}
 */
interface ParseSubpathOptions {
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
   * URL of directory containing relevant `package.json` file.
   */
  dir: ModuleId

  /**
   * Package [`imports`][1] hint.
   *
   * [1]: https://nodejs.org/api/packages.html#imports
   *
   * @default specifier.startsWith('#')
   */
  internal?: boolean | undefined

  /**
   * URL of module to resolve from.
   *
   * **Note**: Used for error reporting only.
   */
  parent: ModuleId
}

export type { ParseSubpathOptions as default }
