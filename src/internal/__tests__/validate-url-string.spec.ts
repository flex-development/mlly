/**
 * @file Unit Tests - validateURLString
 * @module mlly/internal/tests/unit/validateURLString
 */

import { ErrorCode, type NodeError } from '@flex-development/errnode'
import { URL } from 'node:url'
import testSubject from '../validate-url-string'

describe('unit:internal/validateURLString', () => {
  let name: string

  beforeEach(() => {
    name = 'id'
  })

  it('should return true if value is instance of URL', () => {
    expect(testSubject(new URL(import.meta.url), name)).to.be.true
  })

  it('should return true if value is typeof string', () => {
    expect(testSubject(import.meta.url, name)).to.be.true
  })

  it('should throw if value is not instance of URL or typeof string', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_INVALID_ARG_TYPE
    let error: NodeError<TypeError>

    // Act
    try {
      testSubject(null, name)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error!).to.be.instanceof(TypeError)
    expect(error!).to.have.property('code').equal(code)
  })
})
