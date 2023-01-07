/**
 * @file Unit Tests - isArrayIndex
 * @module mlly/internal/tests/unit/isArrayIndex
 */

import testSubject from '../is-array-index'

describe('unit:internal/isArrayIndex', () => {
  it('should return false if key is not numeric property key', () => {
    expect(testSubject('.')).to.be.false
  })

  it('should return true if key is numeric property key', () => {
    expect(testSubject(`${faker.datatype.number()}`)).to.be.true
  })
})
