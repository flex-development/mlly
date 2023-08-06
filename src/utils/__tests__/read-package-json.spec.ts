/**
 * @file Unit Tests - readPackageJson
 * @module mlly/utils/tests/unit/readPackageJson
 */

import type { ModuleId } from '#src/types'
import getPackageJson from '#tests/utils/get-package-json'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import { cast, regexp, type Optional } from '@flex-development/tutils'
import { fileURLToPath, pathToFileURL } from 'node:url'
import testSubject from '../read-package-json'

describe('unit:utils/readPackageJson', () => {
  let parent: ModuleId
  let pkg: PackageJson

  beforeEach(() => {
    parent = import.meta.url
    pkg = getPackageJson('package.json')
  })

  it('should return PackageJson object', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      [],
      [pathToFileURL(process.cwd())],
      [pathToFileURL(process.cwd()).href],
      [process.cwd()]
    ]

    // Act + Expect
    cases.forEach(([dir]) => expect(testSubject(dir)).to.eql(pkg))
  })

  it('should return null if package.json file does not exist', () => {
    expect(testSubject(pathe.resolve('dist'))).to.be.null
  })

  it('should throw if dir is not a string or an instance of URL', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_INVALID_ARG_TYPE
    let error!: NodeError<TypeError>

    // Act
    try {
      testSubject(cast(null))
    } catch (e: unknown) {
      error = cast(e)
    }

    // Expect
    expect(error).to.be.instanceof(TypeError).and.have.property('code', code)
  })

  it('should throw if package.json file is not valid json', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_INVALID_PACKAGE_CONFIG
    const dir: string = '__fixtures__/node_modules/invalid-json'
    const specifier: string = 'invalid-json'
    const cases: [Optional<string>, Optional<ModuleId>, RegExp][] = [
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
      let error!: NodeError

      try {
        testSubject(dir, specifier, parent)
      } catch (e: unknown) {
        error = cast(e)
      }

      expect(error).to.have.property('code', code)
      expect(error).to.have.property('message').match(message_regex)
    })
  })
})
