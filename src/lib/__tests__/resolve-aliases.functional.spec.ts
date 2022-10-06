/**
 * @file Functional Tests - resolveAliases
 * @module mlly/lib/tests/resolveAlias/functional
 */

import type { Spy } from '#tests/interfaces'
import fs from 'node:fs'
import path from 'node:path'
import { loadTsconfig } from 'tsconfig-paths/lib/tsconfig-loader'
import extractStatements from '../extract-statements'
import resolveAlias from '../resolve-alias'
import testSubject from '../resolve-aliases'

vi.mock('tsconfig-paths/lib/tsconfig-loader')
vi.mock('../extract-statements')
vi.mock('../resolve-alias')

describe('functional:lib/resolveAliases', () => {
  const url: string = path.resolve('__fixtures__/path-aliases.cts')

  it('should do nothing if no path aliases are found', () => {
    // Act
    ;(loadTsconfig as unknown as Spy).mockReturnValueOnce(undefined)
    testSubject('export const foo = "bar"', url)

    // Expect
    expect(extractStatements).toHaveBeenCalledOnce()
    expect(resolveAlias).toHaveBeenCalledTimes(0)
  })

  it('should resolve path aliases in code', () => {
    // Act
    const result = testSubject(fs.readFileSync(url, 'utf8'), url)

    // Expect
    expect(extractStatements).toHaveBeenCalledOnce()
    expect(result).toMatchSnapshot()
  })
})
