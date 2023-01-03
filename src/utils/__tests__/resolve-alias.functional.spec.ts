/**
 * @file Functional Tests - resolveAlias
 * @module mlly/utils/tests/resolveAlias/functional
 */

import getCompilerOptions from '#src/internal/get-compiler-options'
import type { Spy } from '#tests/interfaces'
import pathe from '@flex-development/pathe'
import path from 'node:path'
import { createMatchPath } from 'tsconfig-paths'
import tsconfig from '../../../tsconfig.json' assert { type: 'json' }
import testSubject from '../resolve-alias'

vi.mock('#src/internal/get-compiler-options')
vi.mock('@flex-development/pathe')
vi.mock('tsconfig-paths')

describe('functional:utils/resolveAlias', () => {
  const specifier: string = '#src/utils/resolve-alias'
  const tscpath: string = path.resolve('tsconfig.json')

  it('should load tsconfig file', () => {
    // Act
    testSubject(specifier, { tsconfig: tscpath })

    // Expect
    expect(getCompilerOptions).toHaveBeenCalledOnce()
    expect(getCompilerOptions).toHaveBeenCalledWith(tscpath)
  })

  it('should use baseUrl and paths from tsconfig', () => {
    // Arrange
    const { compilerOptions } = tsconfig
    const { baseUrl, paths } = compilerOptions

    // Act
    ;(getCompilerOptions as unknown as Spy).mockReturnValueOnce(compilerOptions)
    testSubject(specifier, { tsconfig: tscpath })

    // Expect
    expect(pathe.dirname).toHaveBeenCalledOnce()
    expect(pathe.dirname).toHaveBeenCalledWith(tscpath)
    expect(pathe.resolve).toHaveBeenCalledOnce()
    expect(pathe.resolve).toHaveBeenCalledWith(path.dirname(tscpath), baseUrl)
    expect(createMatchPath).toHaveBeenCalledOnce()
    expect(createMatchPath).toHaveBeenCalledWith(
      path.resolve(path.dirname(tscpath), baseUrl),
      paths,
      ['main', 'module'],
      true
    )
  })
})
