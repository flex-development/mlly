/**
 * @file Unit Tests - validateExports
 * @module mlly/utils/tests/unit/validateExports
 */

import type { ModuleId } from '#src/types'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import { DOT, cast } from '@flex-development/tutils'
import { URL, pathToFileURL } from 'node:url'
import testSubject from '../validate-exports'

describe('unit:utils/validateExports', () => {
  let code: ErrorCode
  let message_base: RegExp
  let parent: ModuleId
  let pkg: URL

  beforeEach(() => {
    code = ErrorCode.ERR_INVALID_PACKAGE_CONFIG
    message_base = /^Invalid package config \/\S+ while importing \/\S+/
    parent = import.meta.url
    pkg = new URL('package.json', pathToFileURL(DOT + pathe.sep))
  })

  it('should return true if exports is valid', () => {
    // Arrange
    const cases: [Parameters<typeof testSubject>[0]][] = [
      [null],
      ['./index.mjs'],
      [['./index.mjs', './package.json']],
      [{ './package.json': './package.json', [DOT]: './dist/index.mjs' }]
    ]

    // Act + Expect
    cases.forEach(([exports]) => {
      return expect(testSubject(exports, pkg, parent)).to.be.true
    })
  })

  it('should throw if exports is invalid type', () => {
    // Arrange
    const message: RegExp =
      /"exports" must be null, undefined, a string, an object of package subpath keys or condition name keys, or an array containing objects of package subpath keys, objects of condition name keys, or strings$/
    let error!: NodeError

    // Act
    try {
      testSubject(cast(vi.fn()), pkg, parent)
    } catch (e: unknown) {
      error = cast(e)
    }

    // Expect
    expect(error).to.have.property('code', code)
    expect(error).to.have.property('message').match(message_base)
    expect(error).to.have.property('message').match(message)
  })

  it('should throw if exports array contains invalid type', () => {
    // Arrange
    const message: RegExp =
      /The "exports" array must contain either objects of package subpath keys, objects of condition name keys, or strings$/
    let error!: NodeError

    // Act
    try {
      testSubject(cast([vi.fn()]), pkg, parent)
    } catch (e: unknown) {
      error = cast(e)
    }

    // Expect
    expect(error).to.have.property('code', code)
    expect(error).to.have.property('message').match(message_base)
    expect(error).to.have.property('message').match(message)
  })

  it('should throw if exports object has condition and subpath keys', () => {
    // Arrange
    const message: RegExp =
      /"exports" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only\.$/
    let error!: NodeError

    // Act
    try {
      testSubject({ [DOT]: './index.mjs', require: './index.cjs' }, pkg, parent)
    } catch (e: unknown) {
      error = cast(e)
    }

    // Expect
    expect(error).to.have.property('code', code)
    expect(error).to.have.property('message').match(message_base)
    expect(error).to.have.property('message').match(message)
  })

  it('should throw if exports object has numeric property keys', () => {
    // Arrange
    const message: RegExp = /"exports" cannot contain numeric property keys$/
    let error!: NodeError

    // Act
    try {
      testSubject({ [faker.number.int({ max: 13 })]: {} }, pkg, parent)
    } catch (e: unknown) {
      error = cast(e)
    }

    // Expect
    expect(error).to.have.property('code', code)
    expect(error).to.have.property('message').match(message_base)
    expect(error).to.have.property('message').match(message)
  })
})
