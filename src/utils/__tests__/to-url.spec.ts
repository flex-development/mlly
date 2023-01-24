/**
 * @file Unit Tests - toURL
 * @module mlly/utils/tests/unit/toURL
 */

import pathe from '@flex-development/pathe'
import { URL, pathToFileURL } from 'node:url'
import testSubject from '../to-url'

describe('unit:utils/toURL', () => {
  it('should return URL instance', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      [new URL('node:os')],
      ['dist/index.mjs', pathToFileURL('.' + pathe.sep)]
    ]

    // Act + Expect
    cases.forEach(([id, base]) => {
      return expect(testSubject(id, base)).to.be.instanceof(URL)
    })
  })
})
