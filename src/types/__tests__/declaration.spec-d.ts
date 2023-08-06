/**
 * @file Type Tests - Declaration
 * @module mlly/types/tests/unit-d/Declaration
 */

import type TestSubject from '../declaration'

describe('unit-d:types/Declaration', () => {
  it('should extract "class"', () => {
    expectTypeOf<TestSubject>().extract<'class'>().not.toBeNever()
  })

  it('should extract "const enum"', () => {
    expectTypeOf<TestSubject>().extract<'const enum'>().not.toBeNever()
  })

  it('should extract "const"', () => {
    expectTypeOf<TestSubject>().extract<'const'>().not.toBeNever()
  })

  it('should extract "enum"', () => {
    expectTypeOf<TestSubject>().extract<'enum'>().not.toBeNever()
  })

  it('should extract "function"', () => {
    expectTypeOf<TestSubject>().extract<'function'>().not.toBeNever()
  })

  it('should extract "function*"', () => {
    expectTypeOf<TestSubject>().extract<'function*'>().not.toBeNever()
  })

  it('should extract "interface"', () => {
    expectTypeOf<TestSubject>().extract<'interface'>().not.toBeNever()
  })

  it('should extract "let"', () => {
    expectTypeOf<TestSubject>().extract<'let'>().not.toBeNever()
  })

  it('should extract "namespace"', () => {
    expectTypeOf<TestSubject>().extract<'namespace'>().not.toBeNever()
  })

  it('should extract "type"', () => {
    expectTypeOf<TestSubject>().extract<'type'>().not.toBeNever()
  })

  it('should extract "var"', () => {
    expectTypeOf<TestSubject>().extract<'var'>().not.toBeNever()
  })
})
