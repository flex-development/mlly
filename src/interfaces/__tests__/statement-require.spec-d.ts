/**
 * @file Unit Tests - RequireStatement
 * @module mlly/interfaces/tests/unit-d/RequireStatement
 */

import type { SpecifierKind, StatementKind } from '#src/enums'
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
    expectTypeOf<TestSubject>().toHaveProperty('specifier').toBeString()
  })

  it('should match [specifier_kind: SpecifierKind]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('specifier_kind')
      .toEqualTypeOf<SpecifierKind>()
  })

  it('should match [syntax: SyntaxKindRequire]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('syntax')
      .toEqualTypeOf<SyntaxKindRequire>()
  })
})
