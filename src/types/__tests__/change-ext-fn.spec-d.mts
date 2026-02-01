/**
 * @file Type Tests - ChangeExtFn
 * @module mlly/types/tests/unit-d/ChangeExtFn
 */

import type TestSubject from '#types/change-ext-fn'
import type { EmptyString, Ext } from '@flex-development/mlly'

describe('unit-d:types/ChangeExtFn', () => {
  type Extension = EmptyString | Ext
  type Subject = TestSubject<Extension>

  it('should match [this: void]', () => {
    expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [URL, string]', () => {
      expectTypeOf<Subject>().parameters.toEqualTypeOf<[URL, string]>()
    })
  })

  describe('returns', () => {
    it('should return Ext', () => {
      expectTypeOf<Subject>().returns.toEqualTypeOf<Extension>()
    })
  })
})
