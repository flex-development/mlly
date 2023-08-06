/**
 * @file Type Tests - validateArraySet
 * @module mlly/internal/tests/unit-d/validateArraySet
 */

import type testSubject from '../validate-array-set'

describe('unit-d:internal/validateArraySet', () => {
  it('should guard Set<T> | T[]', () => {
    // Arrange
    type T = number

    // Expect
    expectTypeOf<typeof testSubject<T>>().guards.toEqualTypeOf<Set<T> | T[]>()
  })
})
