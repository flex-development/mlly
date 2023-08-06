/**
 * @file Unit Tests - PACKAGE_NAME_REGEX
 * @module mlly/internal/tests/unit/PACKAGE_NAME_REGEX
 */

import TEST_SUBJECT from '../regex-package-name'

describe('unit:internal/PACKAGE_NAME_REGEX', () => {
  it('should match if specifier is valid package name', () => {
    // Arrange
    const cases: [string, Record<string, string | undefined>][] = [
      ['@flex-development/mlly', { scope: '@flex-development' }],
      ['mlly', { scope: undefined }]
    ]

    // Act + Expect
    cases.forEach(([specifier, groups]) => {
      const match = TEST_SUBJECT.exec(specifier)

      expect(match).to.have.deep.property('groups', groups)
    })
  })

  it('should not match if specifier is not valid package name', () => {
    // Arrange
    const cases: string[] = [
      '.start-with-period',
      '@FLEX-DEVELOPMENT/MLLY',
      '@npm-zors/money!time.js',
      'MLLY',
      'foo-pkg!'
    ]

    // Act + Expect
    cases.forEach(specifier => expect(TEST_SUBJECT.test(specifier)).to.be.false)
  })
})
