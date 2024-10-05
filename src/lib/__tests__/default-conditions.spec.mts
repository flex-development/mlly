/**
 * @file Unit Tests - defaultConditions
 * @module mlly/lib/tests/unit/defaultConditions
 */

import testSubject from '#lib/default-conditions'

describe('unit:lib/defaultConditions', () => {
  it('should contain default conditions', () => {
    expect(testSubject).toMatchSnapshot()
  })
})
