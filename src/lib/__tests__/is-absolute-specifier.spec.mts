/**
 * @file Unit Tests - isAbsoluteSpecifier
 * @module mlly/lib/tests/unit/isAbsoluteSpecifier
 */

import nodeUrl from '#fixtures/node-url'
import testSubject from '#lib/is-absolute-specifier'
import { faker } from '@faker-js/faker'
import pkg from '@flex-development/mlly/package.json'
import pathe from '@flex-development/pathe'

describe('unit:lib/isAbsoluteSpecifier', () => {
  it.each<Parameters<typeof testSubject>>([
    ['../is-absolute-specifier'],
    [faker.datatype.boolean()],
    [nodeUrl],
    [pkg.name]
  ])(
    'should return `false` if `value` cannot be absolute specifier (%#)',
    value => {
      expect(testSubject(value)).to.be.false
    }
  )

  it.each<Parameters<typeof testSubject>>([
    [import.meta.url],
    [new URL(import.meta.url)],
    [pathe.cwd()]
  ])(
    'should return `true` if `value` looks like absolute specifier (%#)',
    value => {
      expect(testSubject(value)).to.be.true
    }
  )
})
