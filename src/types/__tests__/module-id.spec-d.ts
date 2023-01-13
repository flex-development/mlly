/**
 * @file Type Tests - ModuleId
 * @module mlly/types/tests/unit-d/ModuleId
 */

import type { URL } from 'node:url'
import type TestSubject from '../module-id'

describe('unit-d:types/ModuleId', () => {
  it('should extract URL', () => {
    expectTypeOf<TestSubject>().extract<URL>().toEqualTypeOf<URL>()
  })

  it('should extract string', () => {
    expectTypeOf<TestSubject>().extract<string>().toBeString()
  })
})
