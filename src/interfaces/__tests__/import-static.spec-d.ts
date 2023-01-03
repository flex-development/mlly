/**
 * @file Type Tests - StaticImport
 * @module mlly/interfaces/tests/unit-d/StaticImport
 */

import type { SyntaxKind } from '#src/enums'
import type { SyntaxKindImport } from '#src/types'
import type { EmptyString, LiteralUnion } from '@flex-development/tutils'
import type TestSubject from '../import-static'
import type ImportStatement from '../statement-import'

describe('unit-d:interfaces/StaticImport', () => {
  it('should extend ImportStatement', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<ImportStatement>()
  })

  it('should match [assertion: LiteralUnion<EmptyString, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('assertion')
      .toEqualTypeOf<LiteralUnion<EmptyString, string>>()
  })

  it('should match [syntax: Omit<SyntaxKindImport, SyntaxKind.DYNAMIC>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('syntax')
      .toMatchTypeOf<Omit<SyntaxKindImport, SyntaxKind.DYNAMIC>>()
  })

  it('should match [type: boolean]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('type').toBeBoolean()
  })
})
