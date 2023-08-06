/**
 * @file Unit Tests - PACKAGE_PATH_REGEX
 * @module mlly/internal/tests/unit/PACKAGE_PATH_REGEX
 */

import TEST_SUBJECT from '../regex-package-path'

describe('unit:internal/PACKAGE_PATH_REGEX', () => {
  it('should match if specifier is valid package path', () => {
    // Arrange
    const cases: [string, Record<string, string | undefined>][] = [
      [
        '@flex-development/mlly',
        {
          pkg: '@flex-development/mlly',
          scope: '@flex-development',
          subpath: undefined,
          version: undefined,
          version_prefix: undefined
        }
      ],
      [
        '@flex-development/mlly@1.0.0-alpha.7',
        {
          pkg: '@flex-development/mlly',
          scope: '@flex-development',
          subpath: undefined,
          version: '1.0.0-alpha.7',
          version_prefix: undefined
        }
      ],
      [
        '@flex-development/mlly@v1.0.0-alpha.7',
        {
          pkg: '@flex-development/mlly',
          scope: '@flex-development',
          subpath: undefined,
          version: '1.0.0-alpha.7',
          version_prefix: 'v'
        }
      ],
      [
        '@flex-development/mlly@v1.0.0-alpha.7/dist/index.mjs',
        {
          pkg: '@flex-development/mlly',
          scope: '@flex-development',
          subpath: '/dist/index.mjs',
          version: '1.0.0-alpha.7',
          version_prefix: 'v'
        }
      ],
      [
        'mlly',
        {
          pkg: 'mlly',
          scope: undefined,
          subpath: undefined,
          version: undefined,
          version_prefix: undefined
        }
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, groups]) => {
      const match = TEST_SUBJECT.exec(specifier)

      expect(match).to.have.deep.property('groups', groups)
    })
  })

  it('should not match if specifier is not valid package path', () => {
    // Arrange
    const cases: string[] = [
      '#src',
      './package.json',
      '@FLEX-DEVELOPMENT/MLLY',
      'MLLY',
      'node:fs',
      'node_modules/@flex-development/mlly',
      import.meta.url
    ]

    // Act + Expect
    cases.forEach(specifier => expect(TEST_SUBJECT.test(specifier)).to.be.false)
  })
})
