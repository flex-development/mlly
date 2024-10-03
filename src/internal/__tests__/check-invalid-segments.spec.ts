/**
 * @file Unit Tests - checkInvalidSegments
 * @module mlly/internal/tests/unit/checkInvalidSegments
 */

import chars from '#internal/chars'
import testSubject from '#internal/check-invalid-segments'
import percentEncode from '#tests/utils/percent-encode'
import pathe from '@flex-development/pathe'

describe('unit:internal/checkInvalidSegments', () => {
  it.each<Parameters<typeof testSubject>>([
    ['./dist/internal/fs.browser.mjs'],
    ['./package.json'],
    ['./src/index.ts'],
    ['fs']
  ])('should return `false` if `str` is valid (%j)', str => {
    expect(testSubject(str)).to.be.false
  })

  it.each<Parameters<typeof testSubject>>([
    [chars.empty],
    [pathe.dot + pathe.sep + '__fixtures__/node_modules/*.json'],
    [pathe.dot + pathe.sep + percentEncode('node_modules') + pathe.sep + '*'],
    [pathe.dot + pathe.win32.sep + pathe.dot],
    [pathe.dot.repeat(2) + pathe.win32.sep + 'index.mjs'],
    [percentEncode(pathe.dot)]
  ])('should return `true` if `str` contains invalid segments (%j)', str => {
    expect(testSubject(str)).to.be.true
  })
})
