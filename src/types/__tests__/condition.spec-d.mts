/**
 * @file Type Tests - Condition
 * @module mlly/types/tests/unit-d/Condition
 */

import type TestSubject from '#types/condition'
import type { ConditionMap } from '@flex-development/mlly'

describe('unit-d:types/Condition', () => {
  it('should equal ConditionMap[keyof ConditionMap]', () => {
    expectTypeOf<TestSubject>()
      .toEqualTypeOf<ConditionMap[keyof ConditionMap]>()
  })
})
