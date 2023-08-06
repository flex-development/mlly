/**
 * @file Type Tests - SyntaxKindExport
 * @module mlly/types/tests/unit-d/SyntaxKindExport
 */

import type { StatementSyntaxKind } from '#src/enums'
import type TestSubject from '../syntax-kind-export'

describe('unit-d:types/SyntaxKindExport', () => {
  it('should extract StatementSyntaxKind.DECLARATION', () => {
    expectTypeOf<TestSubject>()
      .extract<StatementSyntaxKind.DECLARATION>()
      .not.toBeNever()
  })

  it('should extract StatementSyntaxKind.DEFAULT', () => {
    expectTypeOf<TestSubject>()
      .extract<StatementSyntaxKind.DEFAULT>()
      .not.toBeNever()
  })

  it('should extract StatementSyntaxKind.LIST', () => {
    expectTypeOf<TestSubject>()
      .extract<StatementSyntaxKind.LIST>()
      .not.toBeNever()
  })

  it('should extract StatementSyntaxKind.NAMED', () => {
    expectTypeOf<TestSubject>()
      .extract<StatementSyntaxKind.NAMED>()
      .not.toBeNever()
  })

  it('should extract StatementSyntaxKind.NAMESPACE', () => {
    expectTypeOf<TestSubject>()
      .extract<StatementSyntaxKind.NAMESPACE>()
      .not.toBeNever()
  })
})
