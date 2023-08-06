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

  it('should return PromiseLike<X> | X', () => {
    // Arrange
    type Expect<X = Nilable<string>> = PromiseLike<X> | X

    // Expect
    expectTypeOf<TestSubject>().returns.toEqualTypeOf<Expect>()
    expectTypeOf<TestSubject<string>>().returns.toEqualTypeOf<Expect<string>>()
  })
})
