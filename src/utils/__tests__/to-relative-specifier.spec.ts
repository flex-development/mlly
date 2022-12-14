/**
 * @file Unit Tests - toRelativeSpecifier
 * @module mlly/utils/tests/unit/toRelativeSpecifier
 */

import { pathToFileURL } from 'node:url'
import testSubject from '../to-relative-specifier'

describe('unit:utils/toRelativeSpecifier', () => {
  it('should return relative specifier', () => {
    // Arrange
    const cases: [...Parameters<typeof testSubject>, string][] = [
      ['src/interfaces', 'src', './interfaces'],
      ['src/interfaces', 'src/index.ts', './interfaces'],
      ['src/types', 'src/types/ext.ts', '.'],
      ['src/types/index.ts', 'src/types/ext.ts', './index.ts'],
      [
        pathToFileURL('dist/types/parent.mjs'),
        pathToFileURL('dist/utils/to-relative-specifier.mjs'),
        '../types/parent.mjs'
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, parent, expected]) => {
      expect(testSubject(specifier, parent)).to.equal(expected)
    })
  })
})
