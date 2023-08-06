/**
 * @file Type Tests - FORMAT_TYPE_MAP
 * @module mlly/internal/tests/unit-d/FORMAT_TYPE_MAP
 */

import { AssertType, Format } from '#src/enums'
import type TEST_SUBJECT from '../format-type-map'

describe('unit-d:internal/FORMAT_TYPE_MAP', () => {
  it('should be instance of Map<Format, AssertType>', () => {
    expectTypeOf<typeof TEST_SUBJECT>().toEqualTypeOf<Map<Format, AssertType>>()
  })
})
