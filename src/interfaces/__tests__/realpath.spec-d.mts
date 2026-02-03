/**
 * @file Type Tests - Realpath
 * @module mlly/interfaces/tests/unit-d/Realpath
 */

import type TestSubject from '#interfaces/realpath'
import type { ModuleId } from '@flex-development/mlly'

describe('unit-d:interfaces/Realpath', () => {
  type T = Promise<string>
  type Subject = TestSubject<T>

  it('should match [this: unknown]', () => {
    expectTypeOf<Subject>().thisParameter.toEqualTypeOf<unknown>()
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
