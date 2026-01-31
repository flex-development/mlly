/**
 * @file Type Tests - EmptyString
 * @module mlly/types/tests/unit-d/EmptyString
 */

import type TestSubject from '#types/empty-string'

describe('unit-d:types/EmptyString', () => {
  it('should equal ""', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<''>()
  })
})
