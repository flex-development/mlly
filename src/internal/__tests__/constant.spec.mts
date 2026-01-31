/**
 * @file Unit Tests - constant
 * @module mlly/internal/tests/unit/constant
 */

import testSubject from '#internal/constant'

describe('unit:internal/constant', () => {
  it('should return a function that returns `value`', () => {
    // Arrange
    const value: unknown = {}

    // Act
    const result = testSubject(value)

    // Expect
    expect(result).to.be.a('function')
    expect(result()).to.eq(value)
  })
})
