/**
 * @file Unit Tests - readPackageJson
 * @module mlly/utils/tests/unit/readPackageJson
 */

import { ErrorCode, NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import testSubject from '../read-package-json'

describe('unit:utils/readPackageJson', () => {
  it('should return PackageJson object', () => {
    // Arrange
    const pkg: PackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const cases: Parameters<typeof testSubject>[0][] = [
      pathToFileURL(process.cwd()),
      pathToFileURL(process.cwd()).href,
      process.cwd(),
      undefined
    ]

    // Act + Expect
    cases.forEach(dir => expect(testSubject(dir)).deep.equal(pkg))
  })

  it('should return null if package.json file does not exist', () => {
    expect(testSubject(pathe.resolve('dist'))).to.be.null
  })

  it('should throw if dir is not a string or an instance of URL', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_INVALID_ARG_TYPE
    let error: NodeError<TypeError>

    // Act
    try {
      testSubject(null as unknown as string)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!).to.have.property('code').equal(code)
  })

  it('should throw if package.json file is not valid json', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_INVALID_PACKAGE_CONFIG
    const dir: string = '__fixtures__/node_modules/package-invalid-json'
    const err: string = `Invalid package config ${dir}/package.json`
    const parent: string = import.meta.url
    const specifier: string = 'package-invalid-json'
    const cases: [...Parameters<typeof testSubject>, string][] = [
      [dir, undefined, undefined, err],
      [dir, specifier, undefined, `${err} while importing '${specifier}'`],
      [
        dir,
        specifier,
        parent,
        `${err} while importing '${specifier}' from ${parent}`
      ]
    ]

    // Act + Expect
    cases.forEach(([dir, specifier, parent, expected]) => {
      let error: NodeError

      try {
        testSubject(dir, specifier, parent)
      } catch (e: unknown) {
        error = e as typeof error
      }

      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').startWith(expected)
    })
  })
})
