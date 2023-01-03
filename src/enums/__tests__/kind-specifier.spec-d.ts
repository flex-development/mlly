/**
 * @file Type Tests - SpecifierKind
 * @module mlly/enums/tests/unit-d/SpecifierKind
 */

import type TestSubject from '../kind-specifier'

describe('unit-d:enums/SpecifierKind', () => {
  it('should match [DYNAMIC = "dynamic"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('DYNAMIC')
      .toMatchTypeOf<'dynamic'>()
  })

  it('should match [STATIC = "static"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('STATIC')
      .toMatchTypeOf<'static'>()
  })
})
