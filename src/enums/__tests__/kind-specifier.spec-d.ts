/**
 * @file Type Tests - SpecifierKind
 * @module mlly/enums/tests/unit-d/SpecifierKind
 */

import type TestSubject from '../kind-specifier'

describe('unit-d:enums/SpecifierKind', () => {
  it('should match [ABSOLUTE = "absolute"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('ABSOLUTE')
      .toMatchTypeOf<'absolute'>()
  })

  it('should match [BARE = "bare"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('BARE')
      .toMatchTypeOf<'bare'>()
  })

  it('should match [RELATIVE = "relative"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('RELATIVE')
      .toMatchTypeOf<'relative'>()
  })
})
