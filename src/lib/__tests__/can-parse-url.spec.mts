/**
 * @file Unit Tests - canParseUrl
 * @module mlly/lib/tests/unit/canParseUrl
 */

import testSubject from '#lib/can-parse-url'
import cwd from '#lib/cwd'

describe('unit:lib/canParseUrl', () => {
  it.each<Parameters<typeof testSubject>>([
    ['/', 'http:'],
    ['vitest.config.mts', undefined]
  ])('should return `false` if `input` cannot be parsed to `URL` (%#)', (
    input,
    base
  ) => {
    expect(testSubject(input, base)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    ['file:', null],
    ['package.json', cwd()]
  ])('should return `true` if `input` can be parsed to `URL` (%#)', (
    input,
    base
  ) => {
    expect(testSubject(input, base)).to.be.true
  })
})
