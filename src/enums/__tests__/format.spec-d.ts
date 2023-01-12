/**
 * @file Type Tests - Format
 * @module mlly/enums/tests/unit-d/Format
 */

import type TestSubject from '../format'

describe('unit-d:enums/Format', () => {
  it('should match [BUILTIN = "builtin"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('BUILTIN')
      .toMatchTypeOf<'builtin'>()
  })

  it('should match [COMMONJS = "commonjs"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('COMMONJS')
      .toMatchTypeOf<'commonjs'>()
  })

  it('should match [JSON = "json"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('JSON')
      .toMatchTypeOf<'json'>()
  })

  it('should match [MODULE = "module"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('MODULE')
      .toMatchTypeOf<'module'>()
  })

  it('should match [WASM = "wasm"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('WASM')
      .toMatchTypeOf<'wasm'>()
  })
})
