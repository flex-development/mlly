/**
 * @file Unit Tests - dequote
 * @module mlly/internal/tests/unit/dequote
 */

import pkg from '../../../package.json'
import testSubject from '../dequote'

describe('unit:internal/dequote', () => {
  it('should return string with double quotes removed', () => {
    // Arrange
    const str: string = "mlly's"

    // Act + Expect
    expect(testSubject(`"${str}"`)).to.equal(str)
  })

  it('should return string with single quotes removed', () => {
    expect(testSubject(`'${pkg.name}'`)).to.equal(pkg.name)
  })
})
