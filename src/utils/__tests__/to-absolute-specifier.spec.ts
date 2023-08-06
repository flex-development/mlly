/**
 * @file Unit Tests - toAbsoluteSpecifier
 * @module mlly/utils/tests/unit/toAbsoluteSpecifier
 */

import pathe from '@flex-development/pathe'
import { pathToFileURL } from 'node:url'
import testSubject from '../to-absolute-specifier'

describe('unit:utils/toAbsoluteSpecifier', () => {
  let specifier: string
  let expected: string

  beforeEach(() => {
    specifier = './src/utils/to-absolute-specifier.ts'
    expected = pathToFileURL(specifier).href
  })

  it('should return specifier as absolute specifier', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      [pathToFileURL(specifier)],
      [pathe.resolve(specifier)],
      [specifier.slice(2)],
      [specifier]
    ]

    // Act + Expect
    cases.forEach(([specifier, cwd]) => {
      expect(testSubject(specifier, cwd)).to.equal(expected)
    })
  })
})
