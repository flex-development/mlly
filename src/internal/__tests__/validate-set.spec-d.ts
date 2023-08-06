/**
 * @file Type Tests - validateSet
 * @module mlly/internal/tests/unit-d/validateSet
 */

import type testSubject from '../validate-set'

describe('unit-d:internal/validateSet', () => {
  it('should guard Set<T>', () => {
    // Arrange
    type T = number

    // Expect
    expectTypeOf<typeof testSubject<T>>().guards.toEqualTypeOf<Set<T>>()
  })
})
