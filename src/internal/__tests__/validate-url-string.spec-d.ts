/**
 * @file Type Tests - validateURLString
 * @module mlly/internal/tests/unit-d/validateURLString
 */

import type { URL } from 'node:url'
import type testSubject from '../validate-url-string'

describe('unit-d:internal/validateURLString', () => {
  it('should guard URL | string', () => {
    expectTypeOf<typeof testSubject>().guards.toEqualTypeOf<URL | string>()
  })
})
