/**
 * @file Unit Tests - lookupPackageScope
 * @module mlly/utils/tests/unit/lookupPackageScope
 */

import { pathToFileURL, type URL } from 'node:url'
import testSubject from '../lookup-package-scope'

describe('unit:utils/lookupPackageScope', () => {
  it('should return null if package.json file is not found', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      ['../index.mjs', pathToFileURL('.')],
      ['__mocks__', pathToFileURL('__mocks__')],
      ['node_modules', undefined]
    ]

    // Act + Expect
    cases.forEach(([id, stop]) => expect(testSubject(id, stop)).to.be.null)
  })

  it('should return PackageScope object if package.json file is found', () => {
    // Arrange
    const dir: URL = pathToFileURL('node_modules/@flex-development/mkbuild')
    const id: string = 'node_modules/@flex-development/mkbuild/dist/index.mjs'

    // Act
    const result = testSubject(id)

    // Expect
    expect(result).to.not.be.null
    expect(result).to.have.property('dir').startWith(dir.href)
    expect(result).to.have.property('pkg').equal(`${result!.dir}/package.json`)
  })
})
