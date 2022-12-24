/**
 * @file Unit Tests - Declaration
 * @module mlly/types/tests/unit-d/Declaration
 */

import type TestSubject from '../declaration'

describe('unit-d:types/Declaration', () => {
  it('should extract "class"', () => {
    expectTypeOf<TestSubject>().extract<'class'>().toBeString()
  })

  it('should extract "const enum"', () => {
    expectTypeOf<TestSubject>().extract<'const enum'>().toBeString()
  })

  it('should extract "const"', () => {
    expectTypeOf<TestSubject>().extract<'const'>().toBeString()
  })

  it('should extract "enum"', () => {
    expectTypeOf<TestSubject>().extract<'enum'>().toBeString()
  })

  it('should extract "function"', () => {
    expectTypeOf<TestSubject>().extract<'function'>().toBeString()
  })

  it('should extract "function*"', () => {
    expectTypeOf<TestSubject>().extract<'function*'>().toBeString()
  })

  it('should extract "interface"', () => {
    expectTypeOf<TestSubject>().extract<'interface'>().toBeString()
  })

  it('should extract "let"', () => {
    expectTypeOf<TestSubject>().extract<'let'>().toBeString()
  })

  it('should extract "namespace"', () => {
    expectTypeOf<TestSubject>().extract<'namespace'>().toBeString()
  })

  it('should extract "type"', () => {
    expectTypeOf<TestSubject>().extract<'type'>().toBeString()
  })

  it('should extract "var"', () => {
    expectTypeOf<TestSubject>().extract<'var'>().toBeString()
  })
})
