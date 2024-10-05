/**
 * @file Type Tests - Protocol
 * @module mlly/types/tests/unit-d/Protocol
 */

import type TestSubject from '#types/protocol'
import type { ProtocolMap } from '@flex-development/mlly'

describe('unit-d:types/Protocol', () => {
  it('should equal Extract<keyof ProtocolMap, string>', () => {
    expectTypeOf<TestSubject>()
      .toEqualTypeOf<Extract<keyof ProtocolMap, string>>()
  })
})
