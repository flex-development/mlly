/**
 * @file Type Tests - ReadFile
 * @module mlly/interfaces/tests/unit-d/ReadFile
 */

import type TestSubject from '#interfaces/read-file'
import type { ModuleId } from '@flex-development/mlly'

describe('unit-d:interfaces/ReadFile', () => {
  type T = Promise<Buffer | string>
  type Subject = TestSubject<T>

  it('should match [this: void]', () => {
    expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [ModuleId]', () => {
      expectTypeOf<Subject>().parameters.toEqualTypeOf<[ModuleId]>()
    })
  })

  describe('returns', () => {
    it('should return T', () => {
      expectTypeOf<Subject>().returns.toEqualTypeOf<T>()
    })
  })
})
