/**
 * @file Unit Tests - isModuleId
 * @module mlly/lib/tests/unit/isModuleId
 */

import nodeUrl from '#fixtures/node-url'
import chars from '#internal/chars'
import testSubject from '#lib/is-module-id'
import pathe from '@flex-development/pathe'

describe('unit:lib/isModuleId', () => {
  it.each<Parameters<typeof testSubject>>([
    [null],
    [31398],
    [new Date()]
  ])('should return `false` if `value` cannot be module id (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [chars.empty],
    [chars.hash],
    [nodeUrl],
    [pathe.dot],
    [pathe.pathToFileURL('package.json')]
  ])('should return `true` if `value` looks like a module id (%#)', value => {
    expect(testSubject(value)).to.be.true
  })
})
