/**
 * @file Type Tests - PatternMatch
 * @module mlly/types/tests/unit-d/PatternMatch
 */

import type TestSubject from '#types/pattern-match'

describe('unit-d:types/PatternMatch', () => {
  it('should match [0: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty(0).toEqualTypeOf<string>()
  })

  it('should match [1: string | null]', () => {
    expectTypeOf<TestSubject>().toHaveProperty(1).toEqualTypeOf<string | null>()
  })
})
