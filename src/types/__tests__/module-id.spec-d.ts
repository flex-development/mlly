/**
 * @file Type Tests - ModuleId
 * @module mlly/types/tests/unit-d/ModuleId
 */

import type TestSubject from '#types/module-id'

describe('unit-d:types/ModuleId', () => {
  it('should extract URL', () => {
    expectTypeOf<TestSubject>().extract<URL>().not.toBeNever()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().not.toBeNever()
  })
})
