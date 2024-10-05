/**
 * @file Unit Tests - cwd
 * @module mlly/lib/tests/unit/cwd
 */

import testSubject from '#lib/cwd'
import pathe from '@flex-development/pathe'

describe('unit:lib/cwd', () => {
  it('should return URL of current working directory', () => {
    // Act
    const result = testSubject()

    // Expect
    expect(result).to.be.instanceof(URL)
    expect(result).to.have.property('pathname', pathe.cwd() + pathe.sep)
    expect(String(result)).to.endWith(pathe.sep)
    expect(result).toMatchSnapshot()
  })
})
