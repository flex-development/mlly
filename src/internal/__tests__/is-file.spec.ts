/**
 * @file Unit Tests - isFile
 * @module mlly/internal/tests/unit/isFile
 */

import testSubject from '../is-file'

describe('unit:internal/isFile', () => {
  it('should return false if id is not path to module', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      ['file.txt'],
      ['node_modules/@flex-development/mkbuild/dist/index.mjs/package.json']
    ]

    // Act + Expect
    cases.forEach(([id]) => expect(testSubject(id)).to.be.false)
  })

  it('should return false if id is path to directory', () => {
    expect(testSubject('src')).to.be.false
  })

  it('should return true if id is path to file', () => {
    expect(testSubject('src/index.ts')).to.be.true
  })
})
