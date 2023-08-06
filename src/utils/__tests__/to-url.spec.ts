/**
 * @file Unit Tests - toURL
 * @module mlly/utils/tests/unit/toURL
 */

import pathe from '@flex-development/pathe'
import { DOT } from '@flex-development/tutils'
import { URL, pathToFileURL } from 'node:url'
import testSubject from '../to-url'

describe('unit:utils/toURL', () => {
  it('should return URL instance', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      ['dist/index.mjs', pathToFileURL(DOT + pathe.sep)],
      [new URL('node:os')]
    ]

    // Act + Expect
    cases.forEach(([id, base]) => {
      return expect(testSubject(id, base)).to.be.instanceof(URL)
    })
  })
})
