/**
 * @file Unit Tests - toBareSpecifier
 * @module mlly/utils/tests/unit/toBareSpecifier
 */

import type { ModuleId } from '#src/types'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import { pathToFileURL } from 'node:url'
import testSubject from '../to-bare-specifier'

describe('unit:utils/toBareSpecifier', () => {
  let parent: ModuleId

  beforeEach(() => {
    parent = import.meta.url
  })

  it('should return specifier as bare specifier', () => {
    // Arrange
    const cases: [Parameters<typeof testSubject>[0], string][] = [
      ['./dist/index.mjs', '@flex-development/mlly'],
      ['./package.json', '@flex-development/mlly/package.json'],
      ['@flex-development/tutils', '@flex-development/tutils'],
      ['esbuild/lib/main.js', 'esbuild'],
      ['fs', 'node:fs'],
      ['node:fs', 'node:fs'],
      ['node_modules/@types/chai', '@types/chai'],
      ['node_modules/colorette/index.js', 'colorette'],
      [pathToFileURL('dist/index.mjs'), '@flex-development/mlly'],
      [pathToFileURL('dist/index.mjs').href, '@flex-development/mlly'],
      [pathe.resolve('dist/index.mjs'), '@flex-development/mlly'],
      [
        'node_modules/@flex-development/mkbuild/dist/plugins/dts/plugin',
        '@flex-development/mkbuild/plugins/dts/plugin'
      ],
      [
        '@flex-development/mkbuild/node_modules/cosmiconfig/dist/Explorer.js',
        'cosmiconfig/dist/Explorer.js'
      ],
      [
        'node_modules/@flex-development/mkbuild/node_modules/p-limit/index.js',
        'p-limit'
      ],
      [
        'node_modules/@flex-development/pathe/node_modules/@flex-development/errnode/dist/index.mjs',
        '@flex-development/errnode'
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, expected]) => {
      expect(testSubject(specifier, parent)).to.equal(expected)
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
