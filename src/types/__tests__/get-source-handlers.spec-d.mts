/**
 * @file Type Tests - GetSourceHandlers
 * @module mlly/types/tests/unit-d/GetSourceHandlers
 */

import type TestSubject from '#types/get-source-handlers'
import type { GetSourceHandler, Protocol } from '@flex-development/mlly'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:types/GetSourceHandlers', () => {
  it('should match [[key: Protocol]: GetSourceHandler | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty<Protocol>('' as Protocol)
      .toEqualTypeOf<Nilable<GetSourceHandler>>()
  })
})
