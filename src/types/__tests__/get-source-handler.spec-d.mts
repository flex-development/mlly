/**
 * @file Type Tests - GetSourceHandler
 * @module mlly/types/tests/unit-d/GetSourceHandler
 */

import type TestSubject from '#types/get-source-handler'
import type { Awaitable, GetSourceContext } from '@flex-development/mlly'

describe('unit-d:types/GetSourceHandler', () => {
  it('should match [this: GetSourceContext]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<GetSourceContext>()
  })

  describe('parameters', () => {
    it('should be callable with [URL]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<[URL]>()
    })
  })

  describe('returns', () => {
    it('should return Awaitable<Uint8Array | string | null | undefined>', () => {
      expectTypeOf<TestSubject>()
        .returns
        .toEqualTypeOf<Awaitable<Uint8Array | string | null | undefined>>()
    })
  })
})
