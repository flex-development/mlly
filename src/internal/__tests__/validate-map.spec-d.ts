/**
 * @file Type Tests - validateMap
 * @module mlly/internal/tests/unit-d/validateMap
 */

import type { PropertyKey } from '@flex-development/tutils'
import type testSubject from '../validate-map'

describe('unit-d:internal/validateMap', () => {
  it('should guard Map<K, V>', () => {
    // Arrange
    type K = PropertyKey
    type V = string

    // Expect
    expectTypeOf<typeof testSubject<K, V>>().guards.toEqualTypeOf<Map<K, V>>()
  })
})
