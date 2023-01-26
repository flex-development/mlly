/**
 * @file Unit Tests - validateObject
 * @module mlly/internal/tests/unit/validateObject
 */

import { ErrorCode, type NodeError } from '@flex-development/errnode'
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
    const cases: Parameters<typeof testSubject>[0][] = [
      faker.datatype.array(),
      faker.datatype.bigInt(),
      faker.datatype.boolean(),
      faker.datatype.number(),
      faker.datatype.string()
    ]

    // Act + Expect
    cases.forEach(value => {
      let error: NodeError<TypeError>

      try {
        testSubject(value, name)
      } catch (e: unknown) {
        error = e as typeof error
      }

      expect(error!).to.be.instanceof(TypeError)
      expect(error!).to.have.property('code').equal(code)
    })
  })
})
