/**
 * @file Type Tests - validateObject
 * @module mlly/internal/tests/unit-d/validateObject
 */

import type { ObjectCurly } from '@flex-development/tutils'
import type testSubject from '../validate-object'

describe('unit-d:internal/validateObject', () => {
  it('should guard ObjectCurly', () => {
    expectTypeOf<typeof testSubject>().guards.toEqualTypeOf<ObjectCurly>()
  })
})
