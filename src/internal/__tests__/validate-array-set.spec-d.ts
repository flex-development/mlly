/**
 * @file Type Tests - validateArraySet
 * @module mlly/internal/tests/unit-d/validateArraySet
 */

import type testSubject from '../validate-array-set'

describe('unit-d:internal/validateArraySet', () => {
  it('should guard Set<T> | T[]', () => {
    // Arrange
    type Expected = Set<unknown> | unknown[]

    // Expect
    expectTypeOf<typeof testSubject>().guards.toEqualTypeOf<Expected>()
  })
})
