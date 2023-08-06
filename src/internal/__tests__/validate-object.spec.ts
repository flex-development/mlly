/**
 * @file Unit Tests - validateObject
 * @module mlly/internal/tests/unit/validateObject
 */

import { ErrorCode, type NodeError } from '@flex-development/errnode'
import { cast } from '@flex-development/tutils'
import testSubject from '../validate-object'

describe('unit:internal/validateObject', () => {
  let name: string

  beforeEach(() => {
    name = 'options.paths'
  })

  it('should return true if value is an object', () => {
    ;[{}, new Date()].forEach(value => {
      return expect(testSubject(value, name)).to.be.true
    })
  })

  it('should throw if value is not an object', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_INVALID_ARG_TYPE
    let error!: NodeError<TypeError>

    // Act
    try {
      testSubject(faker.number.int(), name)
    } catch (e: unknown) {
      error = cast(e)
    }

    // Expect
    expect(error).to.be.instanceof(TypeError).and.have.property('code', code)
  })
})
