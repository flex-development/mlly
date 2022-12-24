/**
 * @file Unit Tests - getCompilerOptions
 * @module mlly/internal/tests/getCompilerOptions/unit
 */

import type { Spy } from '#tests/interfaces'
import * as loader from 'tsconfig-paths/lib/tsconfig-loader'
import tsconfig from '../../../tsconfig.json' assert { type: 'json' }
import testSubject from '../get-compiler-options'

vi.mock('tsconfig-paths/lib/tsconfig-loader')

describe('unit:internal/getCompilerOptions', () => {
  const loadTsconfig = loader.loadTsconfig as unknown as Spy

  it('should return empty object if tsconfig is not found', () => {
    // Arrange
    loadTsconfig.mockImplementationOnce(() => void 0)

    // Act + Expect
    expect(testSubject()).to.deep.equal({})
  })

  it('should return empty object if user options are not found', () => {
    // Arrange
    loadTsconfig.mockImplementationOnce(() => ({}))

    // Act + Expect
    expect(testSubject()).to.deep.equal({})
  })

  it('should return user options', () => {
    // Arrange
    loadTsconfig.mockImplementationOnce(() => tsconfig)

    // Act + Expect
    expect(testSubject()).to.deep.equal(tsconfig.compilerOptions)
  })
})
