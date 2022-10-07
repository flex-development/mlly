/**
 * @file Unit Tests - resolveAlias
 * @module mlly/lib/tests/resolveAlias/unit
 */

import type { ResolveAliasOptions as Options } from '#src/interfaces'
import path from 'node:path'
import testSubject from '../resolve-alias'

describe('unit:lib/resolveAlias', () => {
  const paths: NonNullable<Options['paths']> = {
    '#fixtures/*': ['__fixtures__/*'],
    '#src/*': ['src/*'],
    '@flex-development/tutils/*': [
      'node_modules/@flex-development/tutils/dist/*'
    ]
  }

  it('should convert alias from unknown parent to absolute specifier', () => {
    // Act
    const result = testSubject('#src/lib/detect-syntax', { paths })

    // Expect
    expect(result).to.equal(path.join(process.cwd(), 'src/lib/detect-syntax'))
  })

  it('should convert current directory alias to relative specifier', () => {
    // Arrange
    const parent = path.resolve('src/index.ts')
    const specifier = '#src/constants'

    // Act + Expect
    expect(testSubject(specifier, { parent, paths })).to.equal('./constants')
  })

  it('should convert module alias to relative specifier', () => {
    // Arrange
    const expected = '../../../__fixtures__/aggregate-error-ponyfill.cjs'
    const parent = path.resolve('src/lib/__tests__/detect-syntax.spec.ts')
    const specifier = '#fixtures/aggregate-error-ponyfill.cjs'

    // Act + Expect
    expect(testSubject(specifier, { parent, paths })).to.equal(expected)
  })

  it('should convert node_modules alias to bare specifier', () => {
    // Arrange
    const expected = '@flex-development/tutils/dist/guards/is-node-env'
    const specifier = '@flex-development/tutils/guards/is-node-env'

    // Act + Expect
    expect(testSubject(specifier, { paths })).to.equal(expected)
  })

  it('should convert outer directory alias to relative specifier', () => {
    // Arrange
    const parent = path.resolve('src/interfaces/statement.ts')

    // Act + Expect
    expect(testSubject('#src/types', { parent, paths })).to.equal('../types')
  })

  it('should return specifier if path match was not found', () => {
    // Arrange
    const specifier: string = '#src/lib/resolve-alias'

    // Act
    const results = testSubject(specifier, { paths: {} })

    // Expect
    expect(results).to.equal(specifier)
  })
})
