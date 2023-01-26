/**
 * @file Unit Tests - validateSet
 * @module mlly/internal/tests/unit/validateSet
 */

import { ErrorCode, type NodeError } from '@flex-development/errnode'
import testSubject from '../validate-set'

describe('unit:internal/validateSet', () => {
  let name: string

  beforeEach(() => {
    name = 'options.conditions'
  })

  it('should return true if value is an instance of Set', () => {
    expect(testSubject(new Set(), name)).to.be.true
  })

  it('should throw if value is not an instance of Set', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_INVALID_ARG_TYPE
    let error: NodeError<TypeError>

    // Act
    try {
      testSubject(new Map(), name)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error!).to.be.instanceof(TypeError)
    expect(error!).to.have.property('code').equal(code)
  })
})
