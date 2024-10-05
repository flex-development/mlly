/**
 * @file Unit Tests - isRelativeSpecifier
 * @module mlly/lib/tests/unit/isRelativeSpecifier
 */

import testSubject from '#lib/is-relative-specifier'
import pkg from '@flex-development/mlly/package.json'
import pathe from '@flex-development/pathe'

describe('unit:lib/isRelativeSpecifier', () => {
  it.each<Parameters<typeof testSubject>>([
    ['#internal/fs'],
    [import.meta.url],
    [new URL('node:fs')],
    [pathe.cwd()],
    [pkg.name]
  ])('should return `false` if `specifier` is not relative (%#)', specifier => {
    expect(testSubject(specifier)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [pathe.dot + pathe.sep + 'index.mjs'],
    [pathe.dot.repeat(2) + pathe.sep + 'is-relative-specifier'],
    [pathe.dot.repeat(2)],
    [pathe.dot]
  ])('should return `true` if `specifier` is relative (%#)', specifier => {
    expect(testSubject(specifier)).to.be.true
  })
})
