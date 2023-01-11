/**
 * @file Type Tests - ParsedDataUrl
 * @module mlly/interfaces/tests/unit-d/ParsedDataUrl
 */

import type { MimeType } from '#src/types'
import type { EmptyString, LiteralUnion } from '@flex-development/tutils'
import type TestSubject from '../parsed-data-url'

describe('unit-d:interfaces/ParsedDataUrl', () => {
  it('should match [base64: boolean]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('base64').toBeBoolean()
  })

  it('should match [data: LiteralUnion<EmptyString, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('data')
      .toEqualTypeOf<LiteralUnion<EmptyString, string>>()
  })

  it('should match [href: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('href').toBeString()
  })

  it('should match [mime: LiteralUnion<MimeType, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mime')
      .toEqualTypeOf<LiteralUnion<MimeType, string>>()
  })

  it('should match [pathname: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('pathname').toBeString()
  })

  it('should match [protocol: "data:"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('protocol')
      .toEqualTypeOf<'data:'>()
  })
})
