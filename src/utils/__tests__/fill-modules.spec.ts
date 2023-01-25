/**
 * @file Unit Tests - fillModules
 * @module mlly/utils/tests/unit/fillModules
 */

import isFunction from '#src/internal/is-function'
import type { ChangeExtFn, ModuleId } from '#src/types'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import type { Nilable } from '@flex-development/tutils'
import { pathToFileURL } from 'node:url'
import { dedent } from 'ts-dedent'
import extractStatements from '../extract-statements'
import testSubject from '../fill-modules'
import isRelativeSpecifier from '../is-relative-specifier'

describe('unit:utils/fillModules', () => {
  let code: string
  let parent: ModuleId

  beforeAll(() => {
    code = dedent`
      import { SpecifierSyntaxKind } from '#src/enums'
      import type { FillModuleOptions } from '#src/interfaces'
      import isFunction from '#src/internal/is-function'
      import { ERR_UNKNOWN_FILE_EXTENSION } from '@flex-development/errnode'
      import pathe, { type Ext } from '@flex-development/pathe'
      import type { EmptyString } from '@flex-development/tutils'
      import CONDITIONS from '${pathToFileURL('src/utils/conditions.ts').href}'
      import assert from 'node:assert'
      import type { URL } from 'node:url'
      import extractStatements from './extract-statements'
      import isAbsoluteSpecifier from './is-absolute-specifier'
      import isBareSpecifier from './is-bare-specifier'
      import resolveModule from './resolve-module'
      import toBareSpecifier from './to-bare-specifier'
      import toRelativeSpecifier from './to-relative-specifier'

      await import(foo)

      export const hello = 'world'
    `
    parent = pathToFileURL('src/utils/fill-modules.ts')
  })

  it('should return code with module specifiers fully specified', async () => {
    for (const ext of ['.mjs', 'mjs']) {
      const expected = extractStatements(code)
        .map(({ specifier }) => {
          return specifier
            ? isRelativeSpecifier(specifier)
              ? specifier + pathe.formatExt(ext)
              : specifier
            : ''
        })
        .filter(specifier => specifier.length > 0)
      const result = extractStatements(await testSubject(code, { ext, parent }))
        .map(s => s.specifier)
        .filter(Boolean)

      expect(result).to.deep.equal(expected)
    }
  })

  it('should throw if new file extension is empty', async () => {
    // Arrange
    const cases: (ChangeExtFn | Nilable<string>)[] = [, null, () => ' ', '']
    const error_code: ErrorCode = ErrorCode.ERR_UNKNOWN_FILE_EXTENSION

    // Act + Expect
    for (const ext of cases) {
      const ext_regex: RegExp = new RegExp(`'${isFunction(ext) ? ' ' : ext}'`)
      let error: NodeError<TypeError>

      try {
        await testSubject(code, {
          ext: ext as ChangeExtFn<string> | string,
          parent
        })
      } catch (e: unknown) {
        error = e as typeof error
      }

      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(error_code)
      expect(error!).to.have.property('message').match(ext_regex)
    }
  })
})
