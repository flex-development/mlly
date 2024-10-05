/**
 * @file Unit Tests - lookupPackageScope
 * @module mlly/lib/tests/unit/lookupPackageScope
 */

import testSubject from '#lib/lookup-package-scope'
import { pathToFileURL, sep } from '@flex-development/pathe'

describe('unit:lib/lookupPackageScope', () => {
  it('should return `null` if package directory is not found', () => {
    // Arrange
    const url: URL = pathToFileURL('node_modules/@flex-development/404.mjs')

    // Act + Expect
    expect(testSubject(url)).to.be.null
  })

  it.each<Parameters<typeof testSubject>>([
    [import.meta.url],
    [pathToFileURL('.remarkrc.mjs')],
    [pathToFileURL('package.json')],
    [pathToFileURL('node_modules/@commitlint/cli/index.cjs')],
    [pathToFileURL(
      'node_modules/@commitlint/cli/node_modules/@commitlint/config-validator/lib/validate.js'
    )],
    [pathToFileURL('node_modules/esbuild/lib/main.js')]
  ])('should return URL of package directory (%#)', url => {
    // Act
    const result = testSubject(url)
    const resultStr = String(result)

    // Expect
    expect(result).to.not.be.null
    expect(resultStr).to.endWith(sep)
    expect(String(url)).to.startWith(resultStr)
    expect(resultStr).toMatchSnapshot()
  })
})
