/**
 * @file Unit Tests - identity
 * @module mlly/internal/tests/unit/identity
 */

import testSubject from '#internal/identity'

describe('unit:internal/identity', () => {
  it('should return `value`', () => {
    // Arrange
    const value: unknown = {}

    // Act + Expect
    expect(testSubject(value)).to.eq(value)
  })
})
