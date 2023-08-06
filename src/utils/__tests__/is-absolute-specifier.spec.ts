/**
 * @file Unit Tests - isAbsoluteSpecifier
 * @module mlly/utils/tests/unit/isAbsoluteSpecifier
 */

import { DOT } from '@flex-development/tutils'
import { pathToFileURL } from 'node:url'
import pkg from '../../../package.json'
import testSubject from '../is-absolute-specifier'

describe('unit:utils/isAbsoluteSpecifier', () => {
  it('should return false if specifier is not absolute specifier', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [['node:fs'], [pkg.name]]

    // Act + Expect
    cases.forEach(([specifier]) => expect(testSubject(specifier)).to.be.false)
  })

  it('should return true if specifier is absolute specifier', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      [pathToFileURL(DOT).href],
      [process.cwd()]
    ]

    // Act + Expect
    cases.forEach(([specifier]) => expect(testSubject(specifier)).to.be.true)
  })
})
