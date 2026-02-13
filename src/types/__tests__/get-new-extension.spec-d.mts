/**
 * @file Type Tests - GetNewExtension
 * @module mlly/types/tests/unit-d/GetNewExtension
 */

import type TestSubject from '#types/get-new-extension'
import type { EmptyString, Ext } from '@flex-development/mlly'

describe('unit-d:types/GetNewExtension', () => {
  type T = EmptyString | Ext | false | null | undefined
  type Subject = TestSubject<T>

  it('should match [this: void]', () => {
    expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [URL, string]', () => {
      expectTypeOf<Subject>().parameters.toEqualTypeOf<[URL, string]>()
    })
  })

  describe('returns', () => {
    it('should return T', () => {
      expectTypeOf<Subject>().returns.toEqualTypeOf<T>()
    })
  })
})
