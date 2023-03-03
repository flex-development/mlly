/**
 * @file Unit Tests - toBareSpecifier
 * @module mlly/utils/tests/unit/toBareSpecifier
 */

import type { ModuleId } from '#src/types'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import { URL, pathToFileURL } from 'node:url'
import testSubject from '../to-bare-specifier'

describe('unit:utils/toBareSpecifier', () => {
  let getParent: (specifier: ModuleId) => ModuleId
  let parent: ModuleId

  beforeAll(() => {
    parent = import.meta.url

    getParent = (specifier: ModuleId): ModuleId => {
      if (specifier instanceof URL) specifier = specifier.href
      if (!specifier.startsWith('__fixtures__')) return parent
      return pathToFileURL('__fixtures__/parent.ts')
    }
  })

  it('should return specifier as bare specifier', () => {
    // Arrange
    const cases: [ModuleId, string][] = [
      ['./dist/index.mjs', '@flex-development/mlly'],
      ['./package.json', '@flex-development/mlly/package.json'],
      ['@flex-development/tutils', '@flex-development/tutils'],
      ['esbuild/lib/main.js', 'esbuild'],
      ['fs', 'node:fs'],
      ['node:fs', 'node:fs'],
      ['node_modules/@types/chai', 'chai'],
      [pathToFileURL('dist/index.mjs'), '@flex-development/mlly'],
      [pathe.resolve('dist/index.mjs'), '@flex-development/mlly'],
      ['__fixtures__/node_modules/exports-map-2/dist/index', 'exports-map-2'],
      ['__fixtures__/node_modules/exports-map-2/dist/lib', 'exports-map-2/lib'],
      ['__fixtures__/node_modules/exports-map-2/lib', 'exports-map-2/lib'],
      [
        '__fixtures__/node_modules/exports-map-2/dist/lib/utils',
        'exports-map-2/lib/utils'
      ],
      [
        '__fixtures__/node_modules/exports-map-2/lib/utils',
        'exports-map-2/lib/utils'
      ],
      [
        '__fixtures__/node_modules/legacy-main-1/utils.js',
        'legacy-main-1/utils.js'
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, expected]) => {
      expect(testSubject(specifier, getParent(specifier))).to.equal(expected)
    })
  })

  it('should throw if new specifier is invalid package path', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_PACKAGE_PATH_NOT_EXPORTED
    const specifier: string = 'node_modules/@flex-development/mkbuild/dist/cli'
    const subpath_regex: RegExp = /'\.\/dist\/cli'/
    let error: NodeError

    // Act
    try {
      testSubject(specifier, parent)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!).to.have.property('code').equal(code)
    expect(error!).to.have.property('message').match(subpath_regex)
  })

  it('should throw if package scope is not found for specifier', () => {
    // Arrange
    const code: ErrorCode = ErrorCode.ERR_OPERATION_FAILED
    const message: RegExp = /Package scope for '\S+' not found$/
    let error: NodeError

    // Act
    try {
      testSubject(pathe.resolve('node_modules/foo-package/dist/utils'), parent)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error!).to.not.be.undefined
    expect(error!).to.have.property('code').equal(code)
    expect(error!).to.have.property('message').match(message)
  })
})
