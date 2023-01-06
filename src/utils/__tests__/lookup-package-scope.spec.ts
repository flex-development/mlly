/**
 * @file Unit Tests - lookupPackageScope
 * @module mlly/utils/tests/unit/lookupPackageScope
 */

import pathe from '@flex-development/pathe'
import { pathToFileURL } from 'node:url'
import testSubject from '../lookup-package-scope'

describe('unit:utils/lookupPackageScope', () => {
  it('should return null if package.json file is not found', () => {
    expect(testSubject('node_modules')).to.be.null
  })

  it('should return PackageScope object if package.json file is found', () => {
    // Arrange
    const base: string = 'node_modules/@flex-development'
    const cases: [...Parameters<typeof testSubject>, string][] = [
      [`${base}/tsconfig-types/index.d.mts`, 'tsconfig-types'],
      [`file://${pathe.resolve(base, 'errnode/dist/index.mjs')}`, 'errnode'],
      [pathToFileURL(pathe.resolve(base, 'mkbuild/dist/index.mjs')), 'mkbuild'],
      [pathe.resolve(base, 'pkg-types/dist/index.d.mts'), 'pkg-types']
    ]

    // Act + Expect
    cases.forEach(([id, expected]) => {
      expect(testSubject(id))
        .to.have.property('dir')
        .equal(pathe.resolve(base, expected))
    })
  })
})
