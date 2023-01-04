/**
 * @file Unit Tests - isAbsoluteSpecifier
 * @module mlly/utils/tests/unit/isAbsoluteSpecifier
 */

import testSubject from '../is-absolute-specifier'

describe('unit:utils/isAbsoluteSpecifier', () => {
  it('should return false if specifier is not absolute specifier', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[0][] = [
      '@flex-development/mlly',
      'node:fs'
    ]

    // Act + Expect
    cases.forEach(specifier => expect(testSubject(specifier)).to.be.false)
  })

  it('should return true if specifier is absolute specifier', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[0][] = [
      'file://' + process.cwd(),
      process.cwd()
    ]

    // Act + Expect
    cases.forEach(specifier => expect(testSubject(specifier)).to.be.true)
  })
})
