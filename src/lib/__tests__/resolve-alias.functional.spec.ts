/**
 * @file Functional Tests - resolveAlias
 * @module mlly/lib/tests/resolveAlias/functional
 */

import type { Spy } from '#tests/interfaces'
import path from 'node:path'
import { createMatchPath } from 'tsconfig-paths'
import upath from 'upath'
import tsconfig from '../../../tsconfig.json' assert { type: 'json' }
import getCompilerOptions from '../get-compiler-options'
import testSubject from '../resolve-alias'

vi.mock('tsconfig-paths')
vi.mock('upath')
vi.mock('../get-compiler-options')

describe('functional:lib/resolveAlias', () => {
  const specifier: string = '#src/lib/resolve-alias'
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
    expect(upath.dirname).toHaveBeenCalledOnce()
    expect(upath.dirname).toHaveBeenCalledWith(tscpath)
    expect(upath.resolve).toHaveBeenCalledOnce()
    expect(upath.resolve).toHaveBeenCalledWith(path.dirname(tscpath), baseUrl)
    expect(createMatchPath).toHaveBeenCalledOnce()
    expect(createMatchPath).toHaveBeenCalledWith(
      path.resolve(path.dirname(tscpath), baseUrl),
      paths,
      ['main', 'module'],
      true
    )
  })
})
