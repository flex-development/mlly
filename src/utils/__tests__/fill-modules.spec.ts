/**
 * @file Unit Tests - fillModules
 * @module mlly/utils/tests/unit/fillModules
 */

import type { ModuleId } from '#src/types'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import { cast, isFunction, select } from '@flex-development/tutils'
import { pathToFileURL } from 'node:url'
import { dedent } from 'ts-dedent'
import extractStatements from '../extract-statements'
import testSubject from '../fill-modules'
import isRelativeSpecifier from '../is-relative-specifier'

vi.mock('#src/utils/lookup-package-scope')

describe('unit:utils/fillModules', () => {
  let code: string
  let parent: ModuleId

  beforeAll(() => {
    code = dedent`
      import { SpecifierSyntaxKind } from '#src/enums'
      import type { FillModuleOptions } from '#src/interfaces'
      import validateArraySet from '#src/internal/validate-array-set'
      import validateURLString from '#src/internal/validate-url-string'
      import {
        ERR_UNKNOWN_FILE_EXTENSION,
        type NodeError
      } from '@flex-development/errnode'
      import pathe from '@flex-development/pathe'
      import {
        DOT,
        isFunction,
        regexp,
        trim,
        type Optional
      } from '@flex-development/tutils'
      import CONDITIONS from '${pathToFileURL('src/utils/conditions.ts').href}'
      import assert from 'node:assert'
      import type { URL } from 'node:url'
      import extractStatements from './extract-statements'
      import isAbsoluteSpecifier from './is-absolute-specifier'
      import isBareSpecifier from './is-bare-specifier'
      import resolveModule from './resolve-module'
      import toBareSpecifier from './to-bare-specifier'
      import toRelativeSpecifier from './to-relative-specifier'
    `
    parent = pathToFileURL('src/utils/fill-modules.ts')
  })

  it('should return code with module specifiers fully specified', async () => {
    for (const ext of ['.mjs', 'mjs']) {
      // Arrange
      const expected = select(
        extractStatements(code),
        statement => isRelativeSpecifier(statement.specifier!),
        statement => statement.specifier! + pathe.formatExt(ext)
      )

      // Act
      const result = select(
        extractStatements(await testSubject(code, { ext, parent })),
        statement => isRelativeSpecifier(statement.specifier!),
        statement => statement.specifier!
      )

      // Expect
      expect(result).to.eql(expected)
    }
  })

  it('should throw if new file extension is empty', async () => {
    // Arrange
    const error_code: ErrorCode = ErrorCode.ERR_UNKNOWN_FILE_EXTENSION

    // Act + Expect
    for (const ext of [, null, () => ' ', '']) {
      const ext_regex: RegExp = new RegExp(`'${isFunction(ext) ? ' ' : ext}'`)
      let error!: NodeError<TypeError>

      try {
        await testSubject(code, { ext: cast(ext), parent })
      } catch (e: unknown) {
        error = cast(e)
      }

      expect(error).to.be.instanceof(TypeError)
      expect(error).to.have.property('code', error_code)
      expect(error).to.have.property('message').match(ext_regex)
    }
  })
})
