/**
 * @file Interfaces - ParsedModuleId
 * @module mlly/interfaces/ParsedModuleId
 */

import type { Protocol } from '#src/types'
import type { SemanticVersion } from '@flex-development/pkg-types'
import type { EmptyString, LiteralUnion } from '@flex-development/tutils'

/**
 * Object representing a ECMAScript module id.
 *
 * @see {@linkcode Protocol}
 * @see {@linkcode SemanticVersion}
 */
interface ParsedModuleId {
  /**
   * Subpath import check.
   *
   * @see https://nodejs.org/api/packages.html#imports
   * @see https://nodejs.org/api/packages.html#subpath-imports
   */
  internal: boolean

  /**
   * One of the following:
   *
   * - Possible [subpath export][1] or [subpath import][2]
   * - URL hostname and pathname
   * - Raw module id ({@linkcode raw})
   *
   * [1]: https://nodejs.org/api/packages.html#subpath-exports
   * [2]: https://nodejs.org/api/packages.html#subpath-imports
   */
  path: string

  /**
   * Package name if module id is [bare specifier][1].
   *
   * If the module id is a bare specifier *and* [subpath import][2], the package
   * name will be the first path segement of the module id (i.e. `'#src'` in
   * `'#src/utils'`).
   *
   * [1]: https://nodejs.org/api/esm.html#terminology
   * [2]: https://nodejs.org/api/packages.html#subpath-imports
   */
  pkg: LiteralUnion<EmptyString, string>

  /**
   * URL scheme if module id is a URL.
   */
  protocol: LiteralUnion<EmptyString | Protocol, string>

  /**
   * Raw module id.
   */
  raw: string

  /**
   * Package scope if module id is [bare specifier][1].
   *
   * [1]: https://nodejs.org/api/esm.html#terminology
   */
  scope: LiteralUnion<EmptyString, string>

  /**
   * Package version if specified and module id is [bare specifier][1].
   *
   * [1]: https://nodejs.org/api/esm.html#terminology
   */
  version: LiteralUnion<EmptyString | SemanticVersion, string>

  /**
   * {@linkcode version} prefix if specified and module id is [bare
   * specifier][1].
   *
   * [1]: https://nodejs.org/api/esm.html#terminology
   */
  version_prefix: LiteralUnion<EmptyString | 'v', string>
}

export type { ParsedModuleId as default }
