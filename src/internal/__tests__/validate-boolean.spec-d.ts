/**
 * @file Type Tests - validateBoolean
 * @module mlly/internal/tests/unit-d/validateBoolean
 */

import type testSubject from '../validate-boolean'

describe('unit-d:internal/validateBoolean', () => {
  it('should guard boolean', () => {
    expectTypeOf<typeof testSubject>().guards.toBeBoolean()
  })
})
