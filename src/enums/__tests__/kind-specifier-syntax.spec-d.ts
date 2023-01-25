/**
 * @file Type Tests - SpecifierSyntaxKind
 * @module mlly/enums/tests/unit-d/SpecifierSyntaxKind
 */

import type TestSubject from '../kind-specifier-syntax'

describe('unit-d:enums/SpecifierSyntaxKind', () => {
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
