/**
 * @file Type Tests - Stat
 * @module mlly/interfaces/tests/unit-d/Stat
 */

import type TestSubject from '#interfaces/stat'
import type { ModuleId, Stats } from '@flex-development/mlly'

describe('unit-d:interfaces/Stat', () => {
  type T = Promise<Stats>
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
