/**
 * @file Type Tests - PatternKeyComparison
 * @module mlly/types/tests/unit-d/PatternKeyComparison
 */

import type TestSubject from '#types/pattern-key-comparison'
import type { PatternKeyComparisonMap } from '@flex-development/mlly'

describe('unit-d:types/PatternKeyComparison', () => {
  it('should equal PatternKeyComparisonMap[keyof PatternKeyComparisonMap]', () => {
    // Arrange
    type Expect = PatternKeyComparisonMap[keyof PatternKeyComparisonMap]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
