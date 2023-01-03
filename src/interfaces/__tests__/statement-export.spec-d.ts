/**
 * @file Type Tests - ExportStatement
 * @module mlly/interfaces/tests/unit-d/ExportStatement
 */

import type { StatementKind } from '#src/enums'
import type { Declaration, SyntaxKindExport } from '#src/types'
import type { Nullable } from '@flex-development/tutils'
import type Statement from '../statement'
import type TestSubject from '../statement-export'

describe('unit-d:interfaces/ExportStatement', () => {
  it('should extend Statement', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<Statement>()
  })

  it('should match [declaration: Nullable<Declaration>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('declaration')
      .toEqualTypeOf<Nullable<Declaration>>()
  })

  it('should match [exports: string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('exports')
      .toEqualTypeOf<string[]>()
  })

  it('should match [kind: StatementKind.EXPORT]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('kind')
      .toEqualTypeOf<StatementKind.EXPORT>()
  })

  it('should match [modifiers: string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('modifiers')
      .toEqualTypeOf<string[]>()
  })

  it('should match [syntax: SyntaxKindExport]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('syntax')
      .toEqualTypeOf<SyntaxKindExport>()
  })

  it('should match [type: boolean]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('type').toBeBoolean()
  })
})
