/**
 * @file Type Tests - isArrayIndex
 * @module mlly/internal/tests/unit-d/isArrayIndex
 */

import type { Numeric } from '@flex-development/tutils'
import type testSubject from '../is-array-index'

describe('unit-d:internal/isArrayIndex', () => {
  it('should guard Numeric', () => {
    expectTypeOf<typeof testSubject>().guards.toEqualTypeOf<Numeric>()
  })
})
