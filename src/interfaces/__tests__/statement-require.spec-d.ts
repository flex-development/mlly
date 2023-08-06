/**
 * @file Type Tests - RequireStatement
 * @module mlly/interfaces/tests/unit-d/RequireStatement
 */

import type { SpecifierSyntaxKind, StatementKind } from '#src/enums'
import type { SyntaxKindRequire } from '#src/types'
import type Statement from '../statement'
import type TestSubject from '../statement-require'

describe('unit-d:interfaces/RequireStatement', () => {
  it('should extend Statement', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Statement>()
  })

  it('should match [imports: string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('imports')
      .toEqualTypeOf<string[]>()
  })

  it('should match [kind: StatementKind.REQUIRE]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('kind')
      .toEqualTypeOf<StatementKind.REQUIRE>()
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

  it('should match [syntax: SyntaxKindRequire]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('syntax')
      .toEqualTypeOf<SyntaxKindRequire>()
  })
})
