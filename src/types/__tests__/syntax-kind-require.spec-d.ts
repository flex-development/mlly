/**
 * @file Type Tests - SyntaxKindRequire
 * @module mlly/types/tests/unit-d/SyntaxKindRequire
 */

import type { StatementSyntaxKind } from '#src/enums'
import type TestSubject from '../syntax-kind-require'

describe('unit-d:types/SyntaxKindRequire', () => {
  it('should extract StatementSyntaxKind.REQUIRE', () => {
    expectTypeOf<TestSubject>()
      .extract<StatementSyntaxKind.REQUIRE>()
      .not.toBeNever()
  })
})
