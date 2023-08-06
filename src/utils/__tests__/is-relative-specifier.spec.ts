/**
 * @file Unit Tests - isRelativeSpecifier
 * @module mlly/utils/tests/unit/isRelativeSpecifier
 */

import pathe from '@flex-development/pathe'
import { DOT } from '@flex-development/tutils'
import pkg from '../../../package.json'
import testSubject from '../is-relative-specifier'

describe('unit:utils/isRelativeSpecifier', () => {
  it('should return false if specifier is not relative specifier', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      ['file://' + process.cwd()],
      ['node:fs'],
      [DOT.repeat(3)],
      [pkg.name]
    ]

    // Act + Expect
    cases.forEach(([specifier]) => expect(testSubject(specifier)).to.be.false)
  })

  it('should return true if specifier is relative specifier', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      ['../../utils/index.mjs'],
      [DOT + pathe.sep],
      [DOT]
    ]

    // Act + Expect
    cases.forEach(([specifier]) => expect(testSubject(specifier)).to.be.true)
  })
})
