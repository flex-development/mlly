/**
 * @file Unit Tests - isAbsoluteSpecifier
 * @module mlly/lib/tests/unit/isAbsoluteSpecifier
 */

import testSubject from '#lib/is-absolute-specifier'
import pkg from '@flex-development/mlly/package.json'
import pathe from '@flex-development/pathe'

describe('unit:lib/isAbsoluteSpecifier', () => {
  it.each<Parameters<typeof testSubject>>([
    ['../is-absolute-specifier'],
    [new URL('node:url')],
    [pkg.name]
  ])('should return `false` if `specifier` is not absolute (%#)', specifier => {
    expect(testSubject(specifier)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [import.meta.url],
    [new URL(import.meta.url)],
    [pathe.cwd()]
  ])('should return `true` if `specifier` is absolute (%#)', specifier => {
    expect(testSubject(specifier)).to.be.true
  })
})
