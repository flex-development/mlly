/**
 * @file Unit Tests - invalidPackageTarget
 * @module mlly/internal/tests/unit/invalidPackageTarget
 */

import testSubject from '#internal/invalid-package-target'
import cwd from '#lib/cwd'
import toPackageUrl from '#tests/utils/to-scope-url'
import { codes, isNodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'

describe('unit:internal/invalidPackageTarget', () => {
  it.each<Parameters<typeof testSubject>>([
    [cwd(), '#nm/*', './__fixtures__/node_modules/*', true, import.meta.url],
    [toPackageUrl('invalid-target-array'), pathe.dot, [undefined]],
    [toPackageUrl('invalid-target-bigint'), pathe.dot, 13n]
  ])('should return new `ERR_INVALID_PACKAGE_TARGET` (%#)', (
    packageUrl,
    subpath,
    target,
    isImports,
    parent
  ) => {
    // Act
    const result = testSubject(
      packageUrl,
      subpath,
      target,
      isImports,
      parent
    )

    // Expect
    expect(result).to.satisfy(isNodeError)
    expect(result).to.have.property('code', codes.ERR_INVALID_PACKAGE_TARGET)
    expect(result.message).toMatchSnapshot()
  })
})
