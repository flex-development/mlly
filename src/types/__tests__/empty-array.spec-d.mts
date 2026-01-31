/**
 * @file Type Tests - EmptyArray
 * @module mlly/types/tests/unit-d/EmptyArray
 */

import type TestSubject from '#types/empty-array'

describe('unit-d:types/EmptyArray', () => {
  it('should equal []', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<[]>()
  })
})
