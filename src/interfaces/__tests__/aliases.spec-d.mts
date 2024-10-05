/**
 * @file Type Tests - Aliases
 * @module mlly/interfaces/tests/unit-d/Aliases
 */

import type TestSubject from '#interfaces/aliases'

describe('unit-d:interfaces/Aliases', () => {
  it('should allow empty object', () => {
    assertType<TestSubject>({})
  })

  it('should match [[alias: string]: (string | null | undefined)[] | string | null | undefined]', () => {
    // Arrange
    type Target = (string | null | undefined)[] | string | null | undefined

    // Expect
    expectTypeOf<TestSubject>()
      .toHaveProperty<string>('#tests/*')
      .toEqualTypeOf<Target>()
  })
})
