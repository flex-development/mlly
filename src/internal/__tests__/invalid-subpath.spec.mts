/**
 * @file Unit Tests - invalidSubpath
 * @module mlly/internal/tests/unit/invalidSubpath
 */

import testSubject from '#internal/invalid-subpath'
import cwd from '#lib/cwd'
import toPackageUrl from '#tests/utils/to-package-url'
import { codes, isNodeError } from '@flex-development/errnode'

describe('unit:internal/invalidSubpath', () => {
  it.each<Parameters<typeof testSubject>>([
    ['./*', 'node_modules/esbuild/lib/main.js', toPackageUrl('build-exports')],
    [
      '#fixtures/*',
      'node_modules/subpath-imports/package.json',
      cwd(),
      true,
      import.meta.url
    ]
  ])('should return new `ERR_INVALID_MODULE_SPECIFIER` (%#)', (
    packageUrl,
    subpath,
    isImports,
    parent
  ) => {
    // Act
    const result = testSubject(
      packageUrl,
      subpath,
      isImports,
      parent
    )

    // Expect
    expect(result).to.satisfy(isNodeError)
    expect(result).to.have.property('code', codes.ERR_INVALID_MODULE_SPECIFIER)
    expect(result.message).toMatchSnapshot()
  })
})
