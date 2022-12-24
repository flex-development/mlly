/**
 * @file Unit Tests - DynamicImport
 * @module mlly/interfaces/tests/unit-d/DynamicImport
 */

import type { SyntaxKind } from '#src/enums'
import type { SyntaxKindImport } from '#src/types'
import type { EmptyString, LiteralUnion } from '@flex-development/tutils'
import type TestSubject from '../import-dynamic'
import type ImportStatement from '../statement-import'

describe('unit-d:interfaces/DynamicImport', () => {
  it('should extend ImportStatement', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<ImportStatement>()
  })

  it('should match [expression: LiteralUnion<EmptyString, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('expression')
      .toEqualTypeOf<LiteralUnion<EmptyString, string>>()
  })

  it('should match [options: LiteralUnion<EmptyString, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('options')
      .toEqualTypeOf<LiteralUnion<EmptyString, string>>()
  })

  it('should match [syntax: Extract<SyntaxKindImport, SyntaxKind.DYNAMIC>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('syntax')
      .toEqualTypeOf<Extract<SyntaxKindImport, SyntaxKind.DYNAMIC>>()
  })
})
