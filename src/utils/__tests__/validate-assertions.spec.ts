/**
 * @file Unit Tests - validateAssertions
 * @module mlly/utils/tests/unit/validateAssertions
 */

import { AssertType, Format } from '#src/enums'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import { pathToFileURL } from 'node:url'
import testSubject from '../validate-assertions'

describe('unit:utils/validateAssertions', () => {
  it('should return true if assertions are valid', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[] = [
      [pathToFileURL('.markdownlint.jsonc').href, 'jsonc', { type: 'jsonc' }],
      [pathToFileURL('loader.mjs').href, Format.MODULE],
      [pathToFileURL('package.json'), Format.JSON, { type: AssertType.JSON }]
    ]

    // Act + Expect
    cases.forEach(([id, format, assertions]) => {
      return expect(testSubject(id, format, assertions)).to.be.true
    })
  })

  it('should throw if assertion type is not supported', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED
    let error: NodeError<TypeError>

    // Act
    try {
      testSubject(pathToFileURL('loader.mjs'), Format.MODULE, {
        type: AssertType.IMPLICIT
      })
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!).to.have.property('code').equal(code)
  })

  it('should throw if assertion type is required but missing', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_IMPORT_ASSERTION_TYPE_MISSING
    let error: NodeError<TypeError>

    // Act
    try {
      testSubject(pathToFileURL('package.json'), Format.JSON)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!).to.have.property('code').equal(code)
  })

  it('should throw if assertions are invalid', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_IMPORT_ASSERTION_TYPE_FAILED
    let error: NodeError<TypeError>

    // Act
    try {
      testSubject(pathToFileURL('.markdownlint.jsonc'), Format.MODULE, {
        type: AssertType.JSON
      })
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!).to.have.property('code').equal(code)
  })
})
