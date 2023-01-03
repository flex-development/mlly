/**
 * @file Type Tests - StatementKind
 * @module mlly/enums/tests/unit-d/StatementKind
 */

import type TestSubject from '../kind-statement'

describe('unit-d:enums/StatementKind', () => {
  it('should match [EXPORT = "export"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('EXPORT')
      .toMatchTypeOf<'export'>()
  })

  it('should match [IMPORT = "import"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('IMPORT')
      .toMatchTypeOf<'import'>()
  })

  it('should match [REQUIRE = "require"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('REQUIRE')
      .toMatchTypeOf<'require'>()
  })
})
