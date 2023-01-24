/**
 * @file Unit Tests - readPackageJson
 * @module mlly/utils/tests/unit/readPackageJson
 */

import regexp from '#src/internal/escape-reg-exp'
import type { ModuleId } from '#src/types'
import getPackageJson from '#tests/utils/get-package-json'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import { fileURLToPath, pathToFileURL } from 'node:url'
import testSubject from '../read-package-json'

describe('unit:utils/readPackageJson', () => {
  let parent: ModuleId

  beforeEach(() => {
    parent = import.meta.url
  })

  it('should return PackageJson object', () => {
    // Arrange
    const pkg: PackageJson = getPackageJson('package.json')
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
    const dir: string = '__fixtures__/node_modules/invalid-json'
    const specifier: string = 'invalid-json'
    const cases: [string | undefined, ModuleId | undefined, RegExp][] = [
      [
        undefined,
        undefined,
        new RegExp(`${regexp(pathe.resolve(dir))}\\/package.json\\.`)
      ],
      [
        specifier,
        parent,
        new RegExp(`'${specifier}' from ${regexp(fileURLToPath(parent))}`)
      ],
      [
        pathToFileURL('node_modules/' + specifier).href,
        undefined,
        new RegExp(regexp(pathe.resolve('node_modules/' + specifier)))
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, parent, message_regex]) => {
      let error: NodeError

      try {
        testSubject(dir, specifier, parent)
      } catch (e: unknown) {
        error = e as typeof error
      }

      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(message_regex)
    })
  })
})
