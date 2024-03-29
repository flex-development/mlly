/**
 * @file Unit Tests - isDirectory
 * @module mlly/utils/tests/unit/isDirectory
 */

import { DOT } from '@flex-development/tutils'
import { pathToFileURL } from 'node:url'
import testSubject from '../is-directory'

describe('unit:utils/isDirectory', () => {
  it('should return false if id does not exist', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      ['hello-world.mjs'],
      ['node_modules/@flex-development/errnode/dist/index.mjs/package.json']
    ]

    // Act + Expect
    cases.forEach(([id]) => expect(testSubject(id)).to.be.false)
  })

  it('should return false if id is file id', () => {
    expect(testSubject('src/index.ts')).to.be.false
  })

  it('should return true if id is directory id', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      ['src'],
      [pathToFileURL(DOT).href]
    ]

    // Act + Expect
    cases.forEach(([id]) => expect(testSubject(id)).to.be.true)
  })
})
