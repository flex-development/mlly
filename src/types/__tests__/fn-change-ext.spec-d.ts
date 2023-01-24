/**
 * @file Type Tests - ChangeExtFn
 * @module mlly/types/tests/unit-d/ChangeExtFn
 */

import type { Nilable } from '@flex-development/tutils'
import type { URL } from 'node:url'
import type TestSubject from '../fn-change-ext'

describe('unit-d:types/ChangeExtFn', () => {
  it('should be callable with [string, URL]', () => {
    expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[string, URL]>()
  })

  it('should return Ext | PromiseLike<Ext>', () => {
    // Arrange
    type Expected<Ext = Nilable<string>> = Ext | PromiseLike<Ext>

    // Expect
    expectTypeOf<TestSubject>().returns.toEqualTypeOf<Expected>()
    expectTypeOf<TestSubject<string>>().returns.toEqualTypeOf<
      Expected<string>
    >()
  })
})
