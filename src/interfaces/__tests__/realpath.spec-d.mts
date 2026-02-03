/**
 * @file Type Tests - Realpath
 * @module mlly/interfaces/tests/unit-d/Realpath
 */

import type TestSubject from '#interfaces/realpath'
import type { Awaitable, ModuleId } from '@flex-development/mlly'

describe('unit-d:interfaces/Realpath', () => {
  it('should match [this: unknown]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<unknown>()
  })

  describe('parameters', () => {
    it('should be callable with [ModuleId]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[ModuleId]>()
    })
  })

  describe('returns', () => {
    it('should return Awaitable<string>', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<Awaitable<string>>()
    })
  })
})
