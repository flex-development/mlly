/**
 * @file Type Tests - ReadFile
 * @module mlly/interfaces/tests/unit-d/ReadFile
 */

import type TestSubject from '#interfaces/read-file'
import type { Awaitable, ModuleId } from '@flex-development/mlly'

describe('unit-d:interfaces/ReadFile', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [ModuleId]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[ModuleId]>()
    })
  })

  describe('returns', () => {
    it('should return Awaitable<Buffer | string>', () => {
      expectTypeOf<TestSubject>()
        .returns
        .toEqualTypeOf<Awaitable<Buffer | string>>()
    })
  })
})
