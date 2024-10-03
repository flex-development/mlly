/**
 * @file Unit Tests - isBareSpecifier
 * @module mlly/lib/tests/unit/isBareSpecifier
 */

import testSubject from '#lib/is-bare-specifier'
import pkg from '@flex-development/mlly/package.json'
import pathe from '@flex-development/pathe'

describe('unit:lib/isBareSpecifier', () => {
  it.each<Parameters<typeof testSubject>>([
    ['../is-bare-specifier'],
    [import.meta.url],
    [new URL(import.meta.url)],
    [pathe.cwd()]
  ])('should return `false` if `specifier` is not bare (%#)', specifier => {
    expect(testSubject(specifier)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    ['#internal/check-invalid-segments'],
    [new URL('node:url')],
    [pkg.name]
  ])('should return `true` if `specifier` is bare (%#)', specifier => {
    expect(testSubject(specifier)).to.be.true
  })
})
