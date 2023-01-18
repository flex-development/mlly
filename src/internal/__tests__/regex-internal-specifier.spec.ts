/**
 * @file Unit Tests - INTERNAL_SPECIFIER_REGEX
 * @module mlly/internal/tests/unit/INTERNAL_SPECIFIER_REGEX
 */

import TEST_SUBJECT from '../regex-internal-specifier'

describe('unit:internal/INTERNAL_SPECIFIER_REGEX', () => {
  it('should match if specifier is valid internal specifier', () => {
    // Arrange
    const cases: string[] = ['#src', '#src/utils', '#src/utils/index.ts']

    // Act + Expect
    cases.forEach(specifier => expect(TEST_SUBJECT.test(specifier)).to.be.true)
  })

  it('should not match if specifier is not valid internal specifier', () => {
    // Arrange
    const cases: string[] = [
      '#',
      '#/',
      '#src/utils/',
      '@flex-development/mlly',
      'mlly'
    ]

    // Act + Expect
    cases.forEach(specifier => expect(TEST_SUBJECT.test(specifier)).to.be.false)
  })
})
