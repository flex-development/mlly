/**
 * @file Type Tests - MimeType
 * @module mlly/types/tests/unit-d/MimeType
 */

import type TestSubject from '../mime-type'

describe('unit-d:types/MimeType', () => {
  it('should extract "application/json"', () => {
    expectTypeOf<TestSubject>().extract<'application/json'>().toBeString()
  })

  it('should extract "application/wasm"', () => {
    expectTypeOf<TestSubject>().extract<'application/wasm'>().toBeString()
  })

  it('should extract "text/javascript"', () => {
    expectTypeOf<TestSubject>().extract<'text/javascript'>().toBeString()
  })
})
