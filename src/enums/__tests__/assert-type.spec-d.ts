/**
 * @file Type Tests - AssertType
 * @module mlly/enums/tests/unit-d/AssertType
 */

import type TestSubject from '../assert-type'

describe('unit-d:enums/AssertType', () => {
  it('should match [IMPLICIT = "javascript"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('IMPLICIT')
      .toMatchTypeOf<'javascript'>()
  })

  it('should match [JSON = "json"]', () => {
    expectTypeOf<typeof TestSubject>()
      .toHaveProperty('JSON')
      .toMatchTypeOf<'json'>()
  })
})
