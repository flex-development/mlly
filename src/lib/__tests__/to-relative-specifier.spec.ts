/**
 * @file Unit Tests - toRelativeSpecifier
 * @module mlly/lib/tests/toRelativeSpecifier/unit
 */

import path from 'node:path'
import { pathToFileURL } from 'node:url'
import testSubject from '../to-relative-specifier'

describe('unit:lib/toRelativeSpecifier', () => {
  it('should return specifier relative from current directory', () => {
    // Arrange
    const specifier = pathToFileURL('src/interfaces')
    const parent = path.resolve('src/index.ts')

    // Act + Expect
    expect(testSubject(specifier, parent)).to.equal('./interfaces')
  })

  it('should return specifier relative from outer directory', () => {
    // Arrange
    const specifier = path.resolve('dist/types/parent.mjs')
    const parent = pathToFileURL('dist/lib/to-relative-specifier.mjs')

    // Act + Expect
    expect(testSubject(specifier, parent)).to.equal('../types/parent.mjs')
  })
})
