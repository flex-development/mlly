/**
 * @file Type Tests - StatementSyntaxKind
 * @module mlly/enums/tests/unit-d/StatementSyntaxKind
 */

import type TestSubject from '../kind-statement-syntax'

describe('unit-d:enums/StatementSyntaxKind', () => {
  it('should match [DECLARATION = "declaration"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('DECLARATION')
      .toMatchTypeOf<'declaration'>()
  })

  it('should match [DEFAULT = "default"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('DEFAULT')
      .toMatchTypeOf<'default'>()
  })

  it('should match [DEFAULT_WITH_NAMED = "default-with-named"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('DEFAULT_WITH_NAMED')
      .toMatchTypeOf<'default-with-named'>()
  })

  it('should match [DEFAULT_WITH_NAMESPACE = "default-with-namespace"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('DEFAULT_WITH_NAMESPACE')
      .toMatchTypeOf<'default-with-namespace'>()
  })

  it('should match [DYNAMIC = "dynamic"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('DYNAMIC')
      .toMatchTypeOf<'dynamic'>()
  })

  it('should match [LIST = "list"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('LIST')
      .toMatchTypeOf<'list'>()
  })

  it('should match [NAMED = "named"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('NAMED')
      .toMatchTypeOf<'named'>()
  })

  it('should match [NAMESPACE = "namespace"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('NAMESPACE')
      .toMatchTypeOf<'namespace'>()
  })

  it('should match [REQUIRE = "require"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('REQUIRE')
      .toMatchTypeOf<'require'>()
  })

  it('should match [SIDE_EFFECT = "side-effect"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('SIDE_EFFECT')
      .toMatchTypeOf<'side-effect'>()
  })
})
