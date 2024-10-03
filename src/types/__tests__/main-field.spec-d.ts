/**
 * @file Type Tests - MainField
 * @module mlly/types/tests/unit-d/MainField
 */

import type TestSubject from '#types/main-field'
import type { MainFieldMap } from '@flex-development/mlly'

describe('unit-d:types/MainField', () => {
  it('should equal MainFieldMap[keyof MainFieldMap]', () => {
    expectTypeOf<TestSubject>()
      .toEqualTypeOf<MainFieldMap[keyof MainFieldMap]>()
  })
})
