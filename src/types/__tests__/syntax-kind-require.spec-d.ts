/**
 * @file Type Tests - SyntaxKindRequire
 * @module mlly/types/tests/unit-d/SyntaxKindRequire
 */

import type { SyntaxKind } from '#src/enums'
import type TestSubject from '../syntax-kind-require'

describe('unit-d:types/SyntaxKindRequire', () => {
  it('should extract SyntaxKind.REQUIRE', () => {
    expectTypeOf<TestSubject>().extract<SyntaxKind.REQUIRE>().toBeString()
  })
})
