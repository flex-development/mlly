/**
 * @file Type Tests - SyntaxKindImport
 * @module mlly/types/tests/unit-d/SyntaxKindImport
 */

import type { StatementSyntaxKind } from '#src/enums'
import type TestSubject from '../syntax-kind-import'

describe('unit-d:types/SyntaxKindImport', () => {
  it('should extract StatementSyntaxKind.DEFAULT', () => {
    expectTypeOf<TestSubject>()
      .extract<StatementSyntaxKind.DEFAULT>()
      .not.toBeNever()
  })

  it('should extract StatementSyntaxKind.DEFAULT_WITH_NAMED', () => {
    expectTypeOf<TestSubject>()
      .extract<StatementSyntaxKind.DEFAULT_WITH_NAMED>()
      .not.toBeNever()
  })

  it('should extract StatementSyntaxKind.DEFAULT_WITH_NAMESPACE', () => {
    expectTypeOf<TestSubject>()
      .extract<StatementSyntaxKind.DEFAULT_WITH_NAMESPACE>()
      .not.toBeNever()
  })

  it('should extract StatementSyntaxKind.DYNAMIC', () => {
    expectTypeOf<TestSubject>()
      .extract<StatementSyntaxKind.DYNAMIC>()
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

  it('should extract StatementSyntaxKind.SIDE_EFFECT', () => {
    expectTypeOf<TestSubject>()
      .extract<StatementSyntaxKind.SIDE_EFFECT>()
      .not.toBeNever()
  })
})
