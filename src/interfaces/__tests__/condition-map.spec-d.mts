/**
 * @file Type Tests - ConditionMap
 * @module mlly/interfaces/tests/unit-d/ConditionMap
 */

import type TestSubject from '#interfaces/condition-map'
import type * as pkgTypes from '@flex-development/pkg-types'

describe('unit-d:interfaces/ConditionMap', () => {
  it('should extend pkgTypes.ConditionMap', () => {
    expectTypeOf<TestSubject>().toExtend<pkgTypes.ConditionMap>()
  })
})
