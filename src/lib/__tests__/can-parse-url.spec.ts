/**
 * @file Unit Tests - canParseUrl
 * @module mlly/lib/tests/unit/canParseUrl
 */

import testSubject from '#lib/can-parse-url'

describe('unit:lib/canParseUrl', () => {
  it('should return `false` if `input` cannot be parsed to a `URL`', () => {
    expect(testSubject('/', 'http:')).to.be.false
  })

  it('should return `true` if `input` can be parsed to a `URL`', () => {
    expect(testSubject('file:', null)).to.be.true
  })
})
