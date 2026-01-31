/**
 * @file Unit Tests - isBareSpecifier
 * @module mlly/lib/tests/unit/isBareSpecifier
 */

import nodeUrl from '#fixtures/node-url'
import testSubject from '#lib/is-bare-specifier'
import { faker } from '@faker-js/faker'
import pkg from '@flex-development/mlly/package.json'
import pathe from '@flex-development/pathe'

describe('unit:lib/isBareSpecifier', () => {
  it.each<Parameters<typeof testSubject>>([
    ['../is-bare-specifier'],
    [import.meta.url],
    [faker.number.int()],
    [new URL(import.meta.url)],
    [pathe.cwd()]
  ])(
    'should return `false` if `value` cannot be bare specifier (%#)',
    value => {
      expect(testSubject(value)).to.be.false
    }
  )

  it.each<Parameters<typeof testSubject>>([
    ['#internal/check-invalid-segments'],
    [faker.git.commitSha()],
    [nodeUrl],
    [pkg.name]
  ])(
    'should return `true` if `value` looks like bare specifier (%#)',
    value => {
      expect(testSubject(value)).to.be.true
    }
  )
})
