/**
 * @file Type Tests - IsDirectory
 * @module mlly/interfaces/tests/unit-d/IsDirectory
 */

import type TestSubject from '#interfaces/is-directory'
import type { EmptyArray } from '@flex-development/mlly'

describe('unit-d:interfaces/IsDirectory', () => {
  it('should match [this: unknown]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<unknown>()
  })

  describe('parameters', () => {
    it('should be callable with []', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<EmptyArray>()
    })
  })

  describe('returns', () => {
    it('should return boolean', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<boolean>()
    })
  })
})
