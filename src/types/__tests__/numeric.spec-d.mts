/**
 * @file Type Tests - Numeric
 * @module mlly/types/tests/unit-d/Numeric
 */

import type TestSubject from '#types/numeric'
import type { Numeric } from '@flex-development/tutils'

describe('unit-d:types/Numeric', () => {
  it('should equal tutils.Numeric', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<Numeric>()
  })
})
