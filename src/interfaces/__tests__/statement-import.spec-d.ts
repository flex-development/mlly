/**
 * @file Type Tests - ImportStatement
 * @module mlly/interfaces/tests/unit-d/ImportStatement
 */

import type { SpecifierSyntaxKind, StatementKind } from '#src/enums'
import type { SyntaxKindImport } from '#src/types'
import type Statement from '../statement'
import type TestSubject from '../statement-import'

describe('unit-d:interfaces/ImportStatement', () => {
  it('should extend Statement', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Statement>()
  })

  it('should match [imports: string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('imports')
      .toEqualTypeOf<string[]>()
  })

  it('should match [kind: StatementKind.IMPORT]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('kind')
      .toEqualTypeOf<StatementKind.IMPORT>()
  })

  it('should match [specifier: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('specifier')
      .toEqualTypeOf<string>()
  })

  it('should match [specifier_syntax: SpecifierSyntaxKind]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('specifier_syntax')
      .toEqualTypeOf<SpecifierSyntaxKind>()
  })

  it('should match [syntax: SyntaxKindImport]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('syntax')
      .toEqualTypeOf<SyntaxKindImport>()
  })
})
