/**
 * @file Type Tests - Awaitable
 * @module mlly/types/tests/unit-d/Awaitable
 */

import type TestSubject from '#types/awaitable'

describe('unit-d:types/Awaitable', () => {
  type T = Uint8Array | string | null | undefined

  it('should extract PromiseLike<T>', () => {
    expectTypeOf<TestSubject<T>>().extract<PromiseLike<T>>().not.toBeNever()
  })

  it('should extract T', () => {
    expectTypeOf<TestSubject<T>>().extract<T>().not.toBeNever()
  })
})
