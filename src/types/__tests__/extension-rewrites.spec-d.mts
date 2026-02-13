/**
 * @file Type Tests - ExtensionRewrites
 * @module mlly/types/tests/unit-d/ExtensionRewrites
 */

import type TestSubject from '#types/extension-rewrites'
import type { EmptyString, Ext } from '@flex-development/mlly'

describe('unit-d:types/ExtensionRewrites', () => {
  it('should equal Partial<Record<EmptyString | Ext, string | false | null | undefined>>', () => {
    // Arrange
    type K = EmptyString | Ext
    type V = string | false | null | undefined

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Partial<Record<K, V>>>()
  })
})
