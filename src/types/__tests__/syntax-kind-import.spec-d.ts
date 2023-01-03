/**
 * @file Type Tests - SyntaxKindImport
 * @module mlly/types/tests/unit-d/SyntaxKindImport
 */

import type { SyntaxKind } from '#src/enums'
import type TestSubject from '../syntax-kind-import'

describe('unit-d:types/SyntaxKindImport', () => {
  it('should extract SyntaxKind.DEFAULT', () => {
    expectTypeOf<TestSubject>().extract<SyntaxKind.DEFAULT>().toBeString()
  })

  it('should extract SyntaxKind.DEFAULT_WITH_NAMED', () => {
    expectTypeOf<TestSubject>()
      .extract<SyntaxKind.DEFAULT_WITH_NAMED>()
      .toBeString()
  })

  it('should extract SyntaxKind.DEFAULT_WITH_NAMESPACE', () => {
    expectTypeOf<TestSubject>()
      .extract<SyntaxKind.DEFAULT_WITH_NAMESPACE>()
      .toBeString()
  })

  it('should extract SyntaxKind.DYNAMIC', () => {
    expectTypeOf<TestSubject>().extract<SyntaxKind.DYNAMIC>().toBeString()
  })

  it('should extract SyntaxKind.NAMED', () => {
    expectTypeOf<TestSubject>().extract<SyntaxKind.NAMED>().toBeString()
  })

  it('should extract SyntaxKind.NAMESPACE', () => {
    expectTypeOf<TestSubject>().extract<SyntaxKind.NAMESPACE>().toBeString()
  })

  it('should extract SyntaxKind.SIDE_EFFECT', () => {
    expectTypeOf<TestSubject>().extract<SyntaxKind.SIDE_EFFECT>().toBeString()
  })
})
