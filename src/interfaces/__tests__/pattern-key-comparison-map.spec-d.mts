/**
 * @file Type Tests - PatternKeyComparisonMap
 * @module mlly/interfaces/tests/unit-d/PatternKeyComparisonMap
 */

import type TestSubject from '#interfaces/pattern-key-comparison-map'

describe('unit-d:interfaces/PatternKeyComparisonMap', () => {
  it('should match [after: 1]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('after').toEqualTypeOf<1>()
  })

  it('should match [before: -1]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('before').toEqualTypeOf<-1>()
  })

  it('should match [equal: 0]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('equal').toEqualTypeOf<0>()
  })
})
