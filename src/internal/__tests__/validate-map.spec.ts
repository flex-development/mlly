/**
 * @file Unit Tests - validateMap
 * @module mlly/internal/tests/unit/validateMap
 */

import { ErrorCode, type NodeError } from '@flex-development/errnode'
import { cast } from '@flex-development/tutils'
import testSubject from '../validate-map'

describe('unit:internal/validateMap', () => {
  let name: string

  beforeEach(() => {
    name = 'options.extension_format_map'
  })

  it('should return true if value is an instance of Map', () => {
    expect(testSubject(new Map(), name)).to.be.true
  })

  it('should throw if value is not an instance of Map', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_INVALID_ARG_TYPE
    let error!: NodeError<TypeError>

    // Act
    try {
      testSubject(new Set(), name)
    } catch (e: unknown) {
      error = cast(e)
    }

    // Expect
    expect(error).to.be.instanceof(TypeError).and.have.property('code', code)
  })
})
