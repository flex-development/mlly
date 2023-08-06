/**
 * @file Type Tests - ImportAssertions
 * @module mlly/interfaces/tests/unit-d/ImportAssertions
 */

import type { AssertType } from '#src/enums'
import type { LiteralUnion, Optional } from '@flex-development/tutils'
import type TestSubject from '../import-assertions'

describe('unit-d:interfaces/ImportAssertions', () => {
  it('should allow empty object', () => {
    assertType<TestSubject>({})
  })

  it('should match [[key: string]: string]', () => {
    expectTypeOf<TestSubject[string]>().toEqualTypeOf<string>()
  })

  it('should match [type?: LiteralUnion<AssertType, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('type')
      .toEqualTypeOf<Optional<LiteralUnion<AssertType, string>>>()
  })
})
