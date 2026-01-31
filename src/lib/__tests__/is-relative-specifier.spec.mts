/**
 * @file Unit Tests - isRelativeSpecifier
 * @module mlly/lib/tests/unit/isRelativeSpecifier
 */

import nodeUrl from '#fixtures/node-url'
import testSubject from '#lib/is-relative-specifier'
import { faker } from '@faker-js/faker'
import pkg from '@flex-development/mlly/package.json'
import pathe from '@flex-development/pathe'

describe('unit:lib/isRelativeSpecifier', () => {
  it.each<Parameters<typeof testSubject>>([
    ['#internal/fs'],
    [import.meta.url],
    [faker.number.bigInt()],
    [nodeUrl],
    [pathe.cwd()],
    [pathe.dot.repeat(3)],
    [pkg.name]
  ])(
    'should return `false` if `value` cannot be relative specifier (%#)',
    value => {
      expect(testSubject(value)).to.be.false
    }
  )

  it.each<Parameters<typeof testSubject>>([
    [pathe.dot + pathe.sep + 'index.mjs'],
    [pathe.dot.repeat(2) + pathe.sep + 'is-relative-specifier'],
    [pathe.dot.repeat(2)],
    [pathe.dot]
  ])(
    'should return `true` if `value` looks like relative specifier (%#)',
    value => {
      expect(testSubject(value)).to.be.true
    }
  )
})
