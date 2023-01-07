/**
 * @file Type Tests - Format
 * @module mlly/types/tests/unit-d/Format
 */

import type TestSubject from '../format'

describe('unit-d:types/Format', () => {
  it('should extract builtin"', () => {
    expectTypeOf<TestSubject>().extract<'builtin'>().toBeString()
  })

  it('should extract "commonjs"', () => {
    expectTypeOf<TestSubject>().extract<'commonjs'>().toBeString()
  })

  it('should extract "json"', () => {
    expectTypeOf<TestSubject>().extract<'json'>().toBeString()
  })

  it('should extract "module"', () => {
    expectTypeOf<TestSubject>().extract<'module'>().toBeString()
  })

  it('should extract "wasm"', () => {
    expectTypeOf<TestSubject>().extract<'wasm'>().toBeString()
  })
})
