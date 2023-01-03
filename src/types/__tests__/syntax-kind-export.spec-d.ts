/**
 * @file Type Tests - SyntaxKindExport
 * @module mlly/types/tests/unit-d/SyntaxKindExport
 */

import type { SyntaxKind } from '#src/enums'
import type TestSubject from '../syntax-kind-export'

describe('unit-d:types/SyntaxKindExport', () => {
  it('should extract SyntaxKind.DECLARATION', () => {
    expectTypeOf<TestSubject>().extract<SyntaxKind.DECLARATION>().toBeString()
  })

  it('should extract SyntaxKind.DEFAULT', () => {
    expectTypeOf<TestSubject>().extract<SyntaxKind.DEFAULT>().toBeString()
  })

  it('should extract SyntaxKind.LIST', () => {
    expectTypeOf<TestSubject>().extract<SyntaxKind.LIST>().toBeString()
  })

  it('should extract SyntaxKind.NAMED', () => {
    expectTypeOf<TestSubject>().extract<SyntaxKind.NAMED>().toBeString()
  })

  it('should extract SyntaxKind.NAMESPACE', () => {
    expectTypeOf<TestSubject>().extract<SyntaxKind.NAMESPACE>().toBeString()
  })
})
