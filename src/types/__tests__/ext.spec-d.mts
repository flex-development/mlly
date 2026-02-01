/**
 * @file Type Tests - Ext
 * @module mlly/types/tests/unit-d/Ext
 */

import type TestSubject from '#types/ext'
import type { Dot } from '@flex-development/mlly'

describe('unit-d:types/Ext', () => {
  it('should equal `${Dot}${string}`', () => {
    expectTypeOf<TestSubject>().toEqualTypeOf<`${Dot}${string}`>()
  })
})
