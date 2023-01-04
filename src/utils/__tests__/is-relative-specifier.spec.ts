/**
 * @file Unit Tests - isRelativeSpecifier
 * @module mlly/utils/tests/unit/isRelativeSpecifier
 */

import testSubject from '../is-relative-specifier'

describe('unit:utils/isRelativeSpecifier', () => {
  it('should return false if specifier is not relative specifier', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[0][] = [
      '...',
      '@flex-development/mlly',
      'file://' + process.cwd(),
      'node:fs'
    ]

    // Act + Expect
    cases.forEach(specifier => expect(testSubject(specifier)).to.be.false)
  })

  it('should return true if specifier is relative specifier', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[0][] = [
      '.',
      './',
      '../../utils/index.mjs'
    ]

    // Act + Expect
    cases.forEach(specifier => expect(testSubject(specifier)).to.be.true)
  })
})
