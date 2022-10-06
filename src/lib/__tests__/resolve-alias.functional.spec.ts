/**
 * @file Functional Tests - resolveAlias
 * @module mlly/lib/tests/resolveAlias/functional
 */

import type { Spy } from '#tests/interfaces'
import path from 'node:path'
import * as pathe from 'pathe'
import { createMatchPath } from 'tsconfig-paths'
import { loadTsconfig } from 'tsconfig-paths/lib/tsconfig-loader'
import tsconfig from '../../../tsconfig.json' assert { type: 'json' }
import testSubject from '../resolve-alias'

vi.mock('pathe')
vi.mock('tsconfig-paths')
vi.mock('tsconfig-paths/lib/tsconfig-loader')

describe('functional:lib/resolveAlias', () => {
  const specifier: string = '#src/lib/resolve-alias'
  const tscpath: string = path.resolve('tsconfig.json')

  it('should load tsconfig file', () => {
    // Act
    ;(loadTsconfig as unknown as Spy).mockReturnValueOnce(undefined)
    testSubject(specifier, { tsconfig: tscpath })

    // Expect
    expect(loadTsconfig).toHaveBeenCalledOnce()
    expect(loadTsconfig).toHaveBeenCalledWith(tscpath, undefined, undefined)
  })

  it('should use baseUrl and paths from tsconfig', () => {
    // Arrange
    const { baseUrl, paths } = tsconfig.compilerOptions

    // Act
    ;(loadTsconfig as unknown as Spy).mockReturnValueOnce(tsconfig)
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
