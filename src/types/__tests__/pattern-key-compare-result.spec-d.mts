/**
 * @file Type Tests - PatternKeyCompareResult
 * @module mlly/types/tests/unit-d/PatternKeyCompareResult
 */

import type TestSubject from '#types/pattern-key-compare-result'

describe('unit-d:types/PatternKeyCompareResult', () => {
  it('should extract -1', () => {
    expectTypeOf<TestSubject>().extract<-1>().not.toBeNever()
  })

  it('should extract 0', () => {
    expectTypeOf<TestSubject>().extract<0>().not.toBeNever()
  })

  it('should extract 1', () => {
    expectTypeOf<TestSubject>().extract<1>().not.toBeNever()
  })
})
