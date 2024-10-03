/**
 * @file Unit Tests - isArrayIndex
 * @module mlly/lib/tests/unit/isArrayIndex
 */

import testSubject from '#lib/is-array-index'

describe('unit:lib/isArrayIndex', () => {
  it('should return `false` if `value` is not valid array index', () => {
    expect(testSubject(null)).to.be.false
  })

  it('should return `true` if `value` is valid array index', () => {
    expect(testSubject(String(faker.number.int({ max: 3, min: 0 })))).to.be.true
  })
})
