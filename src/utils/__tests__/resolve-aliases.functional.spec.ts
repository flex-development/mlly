/**
 * @file Functional Tests - resolveAliases
 * @module mlly/utils/tests/functional/resolveAlias
 */

import type { ResolveAliasOptions as Options } from '#src/interfaces'
import fs from 'node:fs'
import path from 'node:path'
import extractStatements from '../extract-statements'
import resolveAlias from '../resolve-alias'
import testSubject from '../resolve-aliases'

vi.mock('../extract-statements')
vi.mock('../resolve-alias')

describe('functional:utils/resolveAliases', () => {
  const parent: string = path.resolve('__fixtures__/path-aliases.cts')
  const options: Options = { parent, tsconfig: path.resolve('tsconfig.json') }

  it('should do nothing if no path aliases are found', () => {
    // Act
    testSubject('export const foo = "bar"', options)

    // Expect
    expect(extractStatements).toHaveBeenCalledOnce()
    expect(resolveAlias).toHaveBeenCalledTimes(0)
  })

  it('should resolve path aliases in code', () => {
    // Act
    const result = testSubject(fs.readFileSync(parent, 'utf8'), options)

    // Expect
    expect(extractStatements).toHaveBeenCalledOnce()
    expect(result).toMatchSnapshot()
  })
})
