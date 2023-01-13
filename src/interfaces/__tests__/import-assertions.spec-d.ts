/**
 * @file Type Tests - ImportAssertions
 * @module mlly/interfaces/tests/unit-d/ImportAssertions
 */

import type { AssertType } from '#src/enums'
import type { LiteralUnion } from '@flex-development/tutils'
import type TestSubject from '../import-assertions'

describe('unit-d:interfaces/ImportAssertions', () => {
  it('should allow empty object', () => {
    assertType<TestSubject>({})
  })

  it('should allow only string values', () => {
    expectTypeOf<TestSubject[string]>().toBeString()
  })

  it('should match [type?: LiteralUnion<AssertType, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('type')
      .toEqualTypeOf<LiteralUnion<AssertType, string> | undefined>()
  })
})
