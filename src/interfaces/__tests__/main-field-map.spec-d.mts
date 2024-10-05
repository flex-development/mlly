/**
 * @file Type Tests - MainFieldMap
 * @module mlly/interfaces/tests/unit-d/MainFieldMap
 */

import type TestSubject from '#interfaces/main-field-map'

describe('unit-d:interfaces/MainFieldMap', () => {
  it('should match [main: "main"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('main')
      .toEqualTypeOf<'main'>()
  })

  it('should match [module: "module"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('module')
      .toEqualTypeOf<'module'>()
  })

  it('should match [types: "types"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('types')
      .toEqualTypeOf<'types'>()
  })
})
