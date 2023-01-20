/**
 * @file Unit Tests - escapeRegExp
 * @module mlly/internal/tests/unit/escapeRegExp
 */

import testSubject from '../escape-reg-exp'

describe('unit:internal/escapeRegExp', () => {
  it('should escape special characters', () => {
    // Arrange
    const pattern: string = '\\ ^ $ * + ? . ( ) | { } [ ] -'
    const expected: string =
      '\\\\ \\^ \\$ \\* \\+ \\? \\. \\( \\) \\| \\{ \\} \\[ \\] \\x2d'

    // Act + Expect
    expect(testSubject(pattern)).to.equal(expected)
  })
})
