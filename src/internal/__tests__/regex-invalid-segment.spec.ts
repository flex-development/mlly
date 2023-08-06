/**
 * @file Unit Tests - invalidSegmentRegex
 * @module mlly/internal/tests/unit/invalidSegmentRegex
 */

import testSubject from '../regex-invalid-segment'

describe('unit:internal/invalidSegmentRegex', () => {
  let flags: string
  let pattern: string

  beforeAll(() => {
    flags = 'i'
    pattern =
      '(^|\\\\|\\/)((\\.|%2e)(\\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))'
  })

  it('should return deprecated RegExp matching invalid path segment', () => {
    // Arrange
    const source: string = pattern + '(\\\\|\\/|$)'

    // Act
    const result = testSubject('deprecated')

    // Expect
    expect(result).to.have.property('flags', flags)
    expect(result).to.have.property('source', source)
  })

  it('should return RegExp matching invalid path segment', () => {
    // Arrange
    const source: string = pattern + '?(\\\\|\\/|$)'

    // Act
    const result = testSubject()

    // Expect
    expect(result).to.have.property('flags', flags)
    expect(result).to.have.property('source', source)
  })
})
