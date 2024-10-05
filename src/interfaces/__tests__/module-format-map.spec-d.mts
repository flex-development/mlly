/**
 * @file Type Tests - ModuleFormatMap
 * @module mlly/interfaces/tests/unit-d/ModuleFormatMap
 */

import type TestSubject from '#interfaces/module-format-map'

describe('unit-d:interfaces/ModuleFormatMap', () => {
  it('should match [builtin: "builtin"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('builtin')
      .toEqualTypeOf<'builtin'>()
  })

  it('should match [commonjs: "commonjs"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('commonjs')
      .toEqualTypeOf<'commonjs'>()
  })

  it('should match [cts: "commonjs-typescript"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('cts')
      .toEqualTypeOf<'commonjs-typescript'>()
  })

  it('should match [json: "json"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('json')
      .toEqualTypeOf<'json'>()
  })

  it('should match [module: "module"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('module')
      .toEqualTypeOf<'module'>()
  })

  it('should match [mts: "module-typescript"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mts')
      .toEqualTypeOf<'module-typescript'>()
  })

  it('should match [wasm: "wasm"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('wasm')
      .toEqualTypeOf<'wasm'>()
  })
})
