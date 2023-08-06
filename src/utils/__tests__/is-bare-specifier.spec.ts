/**
 * @file Unit Tests - isBareSpecifier
 * @module mlly/utils/tests/unit/isBareSpecifier
 */

import pkg from '../../../package.json'
import testSubject from '../is-bare-specifier'

describe('unit:utils/isBareSpecifier', () => {
  it('should return false if specifier is not bare specifier', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      ['../../utils/index.mjs'],
      ['file://' + process.cwd()],
      [process.cwd()]
    ]

    // Act + Expect
    cases.forEach(([specifier]) => expect(testSubject(specifier)).to.be.false)
  })

  it('should return true if specifier is bare specifier', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      ['#src/internal'],
      ['node:fs'],
      [pkg.name]
    ]

    // Act + Expect
    cases.forEach(([specifier]) => expect(testSubject(specifier)).to.be.true)
  })
})
