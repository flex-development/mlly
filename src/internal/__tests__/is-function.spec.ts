/**
 * @file Unit Tests - isFunction
 * @module mlly/internal/tests/unit/isFunction
 */

import testSubject from '../is-function'

describe('unit:internal/isFunction', () => {
  it('should return false if value is not a function', () => {
    expect(testSubject(faker.number.bigInt())).to.be.false
  })

  it('should return true if value is a function', () => {
    expect(testSubject(vi.fn())).to.be.true
  })
})
