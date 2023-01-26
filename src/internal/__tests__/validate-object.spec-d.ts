/**
 * @file Type Tests - validateObject
 * @module mlly/internal/tests/unit-d/validateObject
 */

import type { ObjectPlain } from '@flex-development/tutils'
import type testSubject from '../validate-object'

describe('unit-d:internal/validateObject', () => {
  it('should guard ObjectPlain', () => {
    expectTypeOf<typeof testSubject>().guards.toEqualTypeOf<ObjectPlain>()
  })
})
