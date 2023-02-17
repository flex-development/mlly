/**
 * @file Unit Tests - validateArraySet
 * @module mlly/internal/tests/unit/validateArraySet
 */

import { ErrorCode, type NodeError } from '@flex-development/errnode'
import testSubject from '../validate-array-set'

describe('unit:internal/validateArraySet', () => {
  let name: string

  beforeEach(() => {
    name = 'options.extensions'
  })

  it('should return true if value is an array', () => {
    expect(testSubject([], name)).to.be.true
  })

  it('should return true if value is instance of Set', () => {
    expect(testSubject(new Set(), name)).to.be.true
  })

  it('should throw if value is not an array or instance of Set', () => {
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
