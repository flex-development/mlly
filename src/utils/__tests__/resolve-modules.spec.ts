/**
 * @file Functional Tests - resolveModules
 * @module mlly/utils/tests/unit/resolveModules
 */

import { pathToFileURL } from 'node:url'
import { dedent } from 'ts-dedent'
import extractStatements from '../extract-statements'
import testSubject from '../resolve-modules'

describe('unit:utils/resolveModules', () => {
  it('should return code with module specifiers fully resolved', async () => {
    // Arrange
    const code = dedent`
      import type { ResolveModuleOptions } from '#src/interfaces'
      import Resolver from '#src/internal/resolver'
      import { ErrorCode, type NodeError } from '@flex-development/errnode'
      import { isBuiltin } from '@flex-development/is-builtin'
      import pathe from '@flex-development/pathe'
      import type { Nullable } from '@flex-development/tutils'
      import { URL, fileURLToPath } from 'node:url'
      import CONDITIONS from './conditions'
      import RESOLVE_EXTENSIONS from './resolve-extensions'

      await import(foo)

      export const hello = 'world'
    `

    // Act
    const result = await testSubject(code, {
      parent: pathToFileURL('src/utils/resolve-module.ts')
    })

    // Expect
    extractStatements(result).forEach(({ specifier }) => {
      expect(specifier ? /^file:|foo|node:/.test(specifier) : true).to.be.true
    })
  })
})
