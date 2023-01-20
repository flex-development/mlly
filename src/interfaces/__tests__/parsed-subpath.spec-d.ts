/**
 * @file Type Tests - ParsedSubpath
 * @module mlly/interfaces/tests/unit-d/ParsedSubpath
 */

import type { EmptyString, LiteralUnion } from '@flex-development/tutils'
import type TestSubject from '../parsed-subpath'

describe('unit-d:interfaces/ParsedSubpath', () => {
  it('should match [base: LiteralUnion<EmptyString, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('base')
      .toEqualTypeOf<LiteralUnion<EmptyString, string>>()
  })

  it('should match [internal: boolean]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('internal').toBeBoolean()
  })

  it('should match [key: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('key').toBeString()
  })

  it('should match [raw: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('raw').toBeString()
  })

  it('should match [specifier: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('specifier').toBeString()
  })
})
