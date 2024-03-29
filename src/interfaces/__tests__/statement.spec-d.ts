/**
 * @file Type Tests - Statement
 * @module mlly/interfaces/tests/unit-d/Statement
 */

import type {
  SpecifierKind,
  SpecifierSyntaxKind,
  StatementKind,
  StatementSyntaxKind
} from '#src/enums'
import type { JsonValue, Nullable } from '@flex-development/tutils'
import type TestSubject from '../statement'

describe('unit-d:interfaces/Statement', () => {
  it('should be json object', () => {
    expectTypeOf<TestSubject[keyof TestSubject]>().toMatchTypeOf<JsonValue>()
  })

  it('should match [code: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('code').toEqualTypeOf<string>()
  })

  it('should match [end: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('end').toEqualTypeOf<number>()
  })

  it('should match [kind: StatementKind]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('kind')
      .toEqualTypeOf<StatementKind>()
  })

  it('should match [specifier: Nullable<string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('specifier')
      .toEqualTypeOf<Nullable<string>>()
  })

  it('should match [specifier_kind: Nullable<SpecifierKind>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('specifier_kind')
      .toEqualTypeOf<Nullable<SpecifierKind>>()
  })

  it('should match [specifier_syntax: Nullable<SpecifierSyntaxKind>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('specifier_syntax')
      .toEqualTypeOf<Nullable<SpecifierSyntaxKind>>()
  })

  it('should match [start: number]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('end').toEqualTypeOf<number>()
  })

  it('should match [syntax: StatementSyntaxKind]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('syntax')
      .toEqualTypeOf<StatementSyntaxKind>()
  })
})
