/**
 * @file Type Tests - validateMap
 * @module mlly/internal/tests/unit-d/validateMap
 */

import type testSubject from '../validate-map'

describe('unit-d:internal/validateMap', () => {
  it('should guard Map<K, V>', () => {
    // Arrange
    type Expected = Map<string, unknown>

    // Expect
    expectTypeOf<typeof testSubject>().guards.toEqualTypeOf<Expected>()
  })
})
