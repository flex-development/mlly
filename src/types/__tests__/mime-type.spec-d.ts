/**
 * @file Type Tests - MimeType
 * @module mlly/types/tests/unit-d/MimeType
 */

import type TestSubject from '../mime-type'

describe('unit-d:types/MimeType', () => {
  it('should extract "application/json"', () => {
    expectTypeOf<TestSubject>().extract<'application/json'>().not.toBeNever()
  })

  it('should extract "application/typescript"', () => {
    expectTypeOf<TestSubject>()
      .extract<'application/typescript'>()
      .not.toBeNever()
  })

  it('should extract "application/wasm"', () => {
    expectTypeOf<TestSubject>().extract<'application/wasm'>().not.toBeNever()
  })

  it('should extract "text/javascript"', () => {
    expectTypeOf<TestSubject>().extract<'text/javascript'>().not.toBeNever()
  })
})
