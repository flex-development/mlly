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
      aliases: {
        '#fixtures/*': ['__fixtures__/*'],
        '#src': ['src/index.ts'],
        '#src/*': ['src/*'],
        '#tests/*': ['__tests__/*']
      },
      ext: '',
      parent: pathToFileURL('src/utils/resolve-alias.ts')
    }
  })

  it('should return code with path aliases resolved', async () => {
    // Arrange
    const code: string = dedent`
      import type { ParsedModuleId, ResolveAliasOptions } from '#src/interfaces'
      import regexp from '#src/internal/escape-reg-exp'
      import validateBoolean from '#src/internal/validate-boolean'
      import validateObject from '#src/internal/validate-object'
      import validateSet from '#src/internal/validate-set'
      import validateString from '#src/internal/validate-string'
      import validateURLString from '#src/internal/validate-url-string'
      import type { NodeError } from '@flex-development/errnode'
      import pathe from '@flex-development/pathe'
      import {
        CompareResult,
        isNIL,
        type Nullable
      } from '@flex-development/tutils'
      import { URL, pathToFileURL } from 'node:url'
      import compareSubpaths from './compare-subpaths'
      import CONDITIONS from './conditions'
      import parseModuleId from './parse-module-id'
      import PATTERN_CHARACTER from './pattern-character'
      import RESOLVE_EXTENSIONS from './resolve-extensions'
      import resolveModule from './resolve-module'
      import toBareSpecifier from './to-bare-specifier'
      import toRelativeSpecifier from './to-relative-specifier'
      import toURL from './to-url'

      await import(foo)

      export default {}
    `

    // Act + Expext
    expect(await testSubject(code, options)).toMatchSnapshot()
  })
})
