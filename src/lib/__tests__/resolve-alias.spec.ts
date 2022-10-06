/**
 * @file Unit Tests - resolveAlias
 * @module mlly/lib/tests/resolveAlias/unit
 */

import type { AliasResolverOptions as Options } from '#src/interfaces'
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

  it('should convert alias from unknown source to absolute specifier', () => {
    // Act
    const result = testSubject('#src/lib/detect-syntax', { paths })

    // Expect
    expect(result).to.equal(path.join(process.cwd(), 'src/lib/detect-syntax'))
  })

  it('should convert current directory alias to relative specifier', () => {
    // Arrange
    const specifier = '#src/constants'
    const url = path.resolve('src/index.ts')

    // Act + Expect
    expect(testSubject(specifier, { paths, url })).to.equal('./constants')
  })

  it('should convert module alias to relative specifier', () => {
    // Arrange
    const expected = '../../../__fixtures__/aggregate-error-ponyfill.cjs'
    const specifier = '#fixtures/aggregate-error-ponyfill.cjs'
    const url = path.resolve('src/lib/__tests__/detect-syntax.spec.ts')

    // Act + Expect
    expect(testSubject(specifier, { paths, url })).to.equal(expected)
  })

  it('should convert node_modules alias to bare specifier', () => {
    // Arrange
    const expected = '@flex-development/tutils/dist/guards/is-node-env'
    const specifier = '@flex-development/tutils/guards/is-node-env'

    // Act + Expect
    expect(testSubject(specifier, { paths })).to.equal(expected)
  })

  it('should convert parent directory alias to relative specifier', () => {
    // Arrange
    const url = path.resolve('src/interfaces/statement.ts')

    // Act + Expect
    expect(testSubject('#src/types', { paths, url })).to.equal('../types')
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
