/**
 * @file Interfaces - ImportAssertions
 * @module mlly/interfaces/ImportAssertions
 */

import type { AssertType } from '#src/enums'
import type { LiteralUnion } from '@flex-development/tutils'

/**
 * `import` assertions schema.
 *
 * @see {@linkcode AssertType}
 * @see https://github.com/tc39/proposal-import-assertions
 */
interface ImportAssertions {
  [key: string]: string

  /**
   * Assertion type.
   */
  type?: LiteralUnion<AssertType, string>
}

export type { ImportAssertions as default }
