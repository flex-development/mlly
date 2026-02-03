/**
 * @file Type Tests - Stat
 * @module mlly/interfaces/tests/unit-d/Stat
 */

import type TestSubject from '#interfaces/stat'
import type { Awaitable, ModuleId, Stats } from '@flex-development/mlly'

describe('unit-d:interfaces/Stat', () => {
  it('should match [this: unknown]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<unknown>()
  })

  describe('parameters', () => {
    it('should be callable with [ModuleId]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[ModuleId]>()
    })
  })

  describe('returns', () => {
    it('should return Awaitable<Stats>', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<Awaitable<Stats>>()
    })
  })
})
