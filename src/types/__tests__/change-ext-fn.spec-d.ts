/**
 * @file Type Tests - ChangeExtFn
 * @module mlly/types/tests/unit-d/ChangeExtFn
 */

import type TestSubject from '#types/change-ext-fn'
import type * as pathe from '@flex-development/pathe'

describe('unit-d:types/ChangeExtFn', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [URL, string]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[URL, string]>()
    })
  })

  describe('returns', () => {
    it('should return Ext', () => {
      // Arrange
      type Ext = pathe.EmptyString | pathe.Ext

      // Expect
      expectTypeOf<TestSubject<Ext>>().returns.toEqualTypeOf<Ext>()
    })
  })
})
