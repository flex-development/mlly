/**
 * @file Unit Tests - readPackageJson
 * @module mlly/lib/tests/unit/readPackageJson
 */

import invalidJsonUrl from '#fixtures/invalid-json-url'
import cwd from '#lib/cwd'
import testSubject from '#lib/read-package-json'
import {
  codes,
  isNodeError,
  type ErrInvalidPackageConfig
} from '@flex-development/errnode'
import pkg from '@flex-development/mlly/package.json'

describe('unit:lib/readPackageJson', () => {
  it('should return `null` if `package.json` file is not found', () => {
    expect(testSubject(import.meta.url)).to.be.null
  })

  it('should return package manifest object', () => {
    expect(testSubject(cwd())).to.eql(pkg)
  })

  it.each<Parameters<typeof testSubject>>([
    [invalidJsonUrl, String(new URL('package.json', invalidJsonUrl))],
    [invalidJsonUrl, 'invalid-json', import.meta.url]
  ])('should throw if package manifest is not valid JSON (%#)', (
    id,
    specifier,
    parent
  ) => {
    // Arrange
    let error!: ErrInvalidPackageConfig

    // Act
    try {
      testSubject(id, specifier, parent)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error).to.satisfy(isNodeError)
    expect(error).to.have.property('code', codes.ERR_INVALID_PACKAGE_CONFIG)
  })
})
