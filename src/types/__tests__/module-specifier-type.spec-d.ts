/**
 * @file Type Tests - ModuleSpecifierType
 * @module mlly/types/tests/unit-d/ModuleSpecifierType
 */

import type TestSubject from '../module-specifier-type'

describe('unit-d:types/ModuleSpecifierType', () => {
  it('should extract "absolute"', () => {
    expectTypeOf<TestSubject>().extract<'absolute'>().toBeString()
  })

  it('should extract "bare"', () => {
    expectTypeOf<TestSubject>().extract<'bare'>().toBeString()
  })

  it('should extract "relative"', () => {
    expectTypeOf<TestSubject>().extract<'relative'>().toBeString()
  })
})
