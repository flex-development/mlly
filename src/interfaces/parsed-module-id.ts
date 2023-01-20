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
   * Subpath import (internal specifier) check.
   *
   * @see https://nodejs.org/api/packages.html#imports
   * @see https://nodejs.org/api/packages.html#subpath-imports
   */
  internal: boolean

  /**
   * One of the following:
   *
   * - Possible [subpath export][1] (includes leading `'.'`)
   * - Possible [subpath import][2]
   * - URL [`host`][3], [`pathname`][4], and [`port`][5]
   * - Raw module id ({@linkcode raw})
   *
   * [1]: https://nodejs.org/api/packages.html#subpath-exports
   * [2]: https://nodejs.org/api/packages.html#subpath-imports
   * [3]: https://nodejs.org/api/url.html#urlhost
   * [4]: https://nodejs.org/api/url.html#urlpathname
   * [5]: https://nodejs.org/api/url.html#urlport
   */
  path: string

  /**
   * Package name if module id begins with valid package name (e.g. is a [bare
   * specifier][1]).
   *
   * If the module id is a bare specifier *and* [internal][2], this value will
   * instead be the first path segement in the module id (i.e. `'#src'` given
   * `'#src/foo'`). This **may or may not** be the subpath defined by the
   * package maintainer.
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
   * Package scope if module id begins with valid package name (e.g. is a [bare
   * specifier][1]).
   *
   * [1]: https://nodejs.org/api/esm.html#terminology
   */
  scope: LiteralUnion<EmptyString, string>

  /**
   * Package version if specified and module id begins with valid package name
   * (e.g. is a [bare specifier][1]).
   *
   * **Note**: Version follows [Semantic Versioning 2.0.0][2] specification.
   *
   * [1]: https://nodejs.org/api/esm.html#terminology
   * [2]: https://semver.org/spec/v2.0.0.html
   */
  version: LiteralUnion<EmptyString | SemanticVersion, string>

  /**
   * Package {@linkcode version} prefix.
   */
  version_prefix: LiteralUnion<EmptyString | 'v', string>
}

export type { ParsedModuleId as default }
