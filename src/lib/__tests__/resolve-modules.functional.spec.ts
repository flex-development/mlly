/**
 * @file Functional Tests - resolveModules
 * @module mlly/lib/tests/resolveModules/functional
 */

import { pathToFileURL } from 'node:url'
import { dedent } from 'ts-dedent'
import resolveModule from '../resolve-module'
import testSubject from '../resolve-modules'

vi.mock('../resolve-module')

describe('functional:lib/resolveModules', () => {
  it('should do nothing if module specifier is missing', async () => {
    // Arrange
    const code = dedent`
      import '${process.cwd()}/src/constants'
      import '${pathToFileURL('src/constants').href}'

      export const hello = 'world'
    `

    // Act
    await testSubject(code, { parent: import.meta.url })

    // Expect
    expect(resolveModule).toHaveBeenCalledTimes(2)
  })

  it('should resolve modules in code', async () => {
    // Arrange
    const code = dedent`
      import isBuiltin from '@flex-development/is-builtin'
      import pathe from '@flex-development/pathe'
      import { moduleResolve, type ErrnoException } from 'import-meta-resolve'
      import { pathToFileURL, URL } from 'node:url'
      import { CONDITIONS, RESOLVE_EXTENSIONS } from '../constants'
      import type { ResolveOptions as Options } from '../interfaces'
      import type { SpecifierType } from '../types'
      import toBareSpecifier from './to-bare-specifier'
      import toRelativeSpecifier from './to-relative-specifier'

      await import(foo)
    `

    // Act
    const result = await testSubject(code, {
      ext: '.mjs',
      parent: pathToFileURL('src/lib/resolve-module.ts')
    })

    // Expect
    expect(resolveModule).toHaveBeenCalledTimes(9)
    expect(result).toMatchSnapshot()
  })
})
