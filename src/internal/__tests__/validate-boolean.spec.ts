/**
 * @file Unit Tests - validateBoolean
 * @module mlly/internal/tests/unit/validateBoolean
 */

import { ErrorCode, type NodeError } from '@flex-development/errnode'
import testSubject from '../validate-boolean'

describe('unit:internal/validateBoolean', () => {
  let name: string

  beforeEach(() => {
    name = 'options.absolute'
  })

  it('should return true if value is typeof boolean', () => {
    ;[false, true].forEach(value => expect(testSubject(value, name)).to.be.true)
  })

  it('should throw if value is not typeof boolean', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_INVALID_ARG_TYPE
    let error: NodeError<TypeError>

    // Act
    try {
      testSubject(faker.datatype.number(), name)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error!).to.be.instanceof(TypeError)
    expect(error!).to.have.property('code').equal(code)
  })
})
