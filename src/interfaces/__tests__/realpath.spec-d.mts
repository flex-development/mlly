/**
 * @file Type Tests - Realpath
 * @module mlly/interfaces/tests/unit-d/Realpath
 */

import type TestSubject from '#interfaces/realpath'
import type { Awaitable, ModuleId } from '@flex-development/mlly'

describe('unit-d:interfaces/Realpath', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
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
