/**
 * @file Unit Tests - ENCODED_SEP_REGEX
 * @module mlly/internal/tests/unit/ENCODED_SEP_REGEX
 */

import TEST_SUBJECT from '../regex-encoded-sep'

describe('unit:internal/ENCODED_SEP_REGEX', () => {
  it('should match if specifier includes "%2F" ("/")', () => {
    expect(TEST_SUBJECT.test('@flex-development%2Fmlly')).to.be.true
  })

  it('should match if specifier includes "%2f" ("/")', () => {
    expect(TEST_SUBJECT.test('@flex-development%2fmlly')).to.be.true
  })

  it('should match if specifier includes "%5C" ("\\")', () => {
    expect(TEST_SUBJECT.test('@flex-development%5C%5Cmlly')).to.be.true
  })

  it('should match if specifier includes "%5c" ("\\")', () => {
    expect(TEST_SUBJECT.test('@flex-development%5c%5cmlly')).to.be.true
  })

  it('should not match if specifier does not include encoded separator', () => {
    expect(TEST_SUBJECT.test(faker.system.filePath())).to.be.false
  })
})
