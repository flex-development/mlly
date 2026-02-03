/**
 * @file Type Tests - FileContent
 * @module mlly/types/tests/unit-d/FileContent
 */

import type TestSubject from '#types/file-content'

describe('unit-d:types/FileContent', () => {
  it('should extract Uint8Array', () => {
    expectTypeOf<TestSubject>().extract<Uint8Array>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})
