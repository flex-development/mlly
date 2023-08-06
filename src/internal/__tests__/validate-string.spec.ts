/**
 * @file Unit Tests - validateString
 * @module mlly/internal/tests/unit/validateString
 */

import { ErrorCode, type NodeError } from '@flex-development/errnode'
import { cast } from '@flex-development/tutils'
import testSubject from '../validate-string'

describe('unit:internal/validateString', () => {
  let name: string

  beforeEach(() => {
    name = 'id'
  })

  it('should return true if value is typeof string', () => {
    expect(testSubject(faker.string.sample(13), name)).to.be.true
  })

  it('should throw if value is not typeof string', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_INVALID_ARG_TYPE
    let error!: NodeError<TypeError>

    // Act
    try {
      testSubject(null, name)
    } catch (e: unknown) {
      error = cast(e)
    }

    // Expect
    expect(error).to.be.instanceof(TypeError).and.have.property('code', code)
  })
})
