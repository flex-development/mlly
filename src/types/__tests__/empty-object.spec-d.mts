/**
 * @file Type Tests - EmptyObject
 * @module mlly/types/tests/unit-d/EmptyObject
 */

import type { default as TestSubject, tag } from '#types/empty-object'
import type { OptionalKeys } from '@flex-development/tutils'

describe('unit-d:types/EmptyObject', () => {
  it('should have all optional keys', () => {
    expectTypeOf<OptionalKeys<TestSubject>>().toEqualTypeOf<keyof TestSubject>()
  })

  it('should match [[tag]?: never]', () => {
    expectTypeOf<TestSubject[typeof tag]>().toBeUndefined()
  })
})
