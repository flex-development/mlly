/**
 * @file Unit Tests - resolveAliases
 * @module mlly/utils/tests/unit/resolveAlias
 */

import type { ResolveAliasOptions } from '#src/interfaces'
import { pathToFileURL } from 'node:url'
import { dedent } from 'ts-dedent'
import testSubject from '../resolve-aliases'

describe('unit:utils/resolveAliases', () => {
  let options: ResolveAliasOptions

  beforeAll(() => {
    options = {
      absolute: false,
      aliases: { '#src/*': ['src/*'] },
      ext: '',
      parent: pathToFileURL('src/utils/resolve-aliases.ts')
    }
  })

  it('should return code with path aliases resolved', async () => {
    // Arrange
    const code: string = dedent`
      import { SpecifierSyntaxKind } from '#src/enums'
      import type { ResolveAliasOptions } from '#src/interfaces'
      import { regexp } from '@flex-development/tutils'
      import extractStatements from './extract-statements'
      import resolveAlias from './resolve-alias'
    `

    // Act + Expext
    expect(await testSubject(code, options)).toMatchSnapshot()
  })
})
