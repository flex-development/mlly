/**
 * @file Unit Tests - lookupPackageScope
 * @module mlly/utils/tests/unit/lookupPackageScope
 */

import pathe from '@flex-development/pathe'
import testSubject from '../lookup-package-scope'

describe('unit:utils/lookupPackageScope', () => {
  it('should return null if package.json file is not found', () => {
    expect(testSubject('node_modules')).to.be.null
  })

  it('should return PackageScope object if package.json file is found', () => {
    // Arrange
    const dir: string = pathe.resolve('node_modules/@flex-development/mkbuild')
    const id: string = 'node_modules/@flex-development/mkbuild/dist/index.mjs'

    // Act
    const result = testSubject(id)

    // Expect
    expect(result).to.not.be.null
    expect(result).to.have.property('dir').equal(dir)
  })
})
