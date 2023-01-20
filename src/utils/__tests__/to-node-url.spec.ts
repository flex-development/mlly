/**
 * @file Unit Tests - toNodeURL
 * @module mlly/utils/tests/unit/toNodeURL
 */

import testSubject from '../to-node-url'

describe('unit:utils/toNodeURL', () => {
  it('should return specifier as node url', () => {
    // Arrange
    const cases: [...Parameters<typeof testSubject>, string][] = [
      ['fs', 'node:fs'],
      ['node:os', 'node:os']
    ]

    // Act + Expect
    cases.forEach(([specifier, expected]) => {
      expect(testSubject(specifier)).to.equal(expected)
    })
  })
})
