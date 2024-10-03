/**
 * @file Unit Tests - patternKeyCompare
 * @module mlly/lib/tests/unit/patternKeyCompare
 */

import chars from '#internal/chars'
import testSubject from '#lib/pattern-key-compare'

describe('unit:lib/patternKeyCompare', () => {
  it.each<Parameters<typeof testSubject>>([
    [chars.asterisk, chars.asterisk],
    ['./constants', './utils/*'],
    ['./enums', './utils'],
    ['./enums/*', './utils/*.mjs'],
    ['./lib/*', './enums'],
    ['./package.json', './constants'],
    ['./utils/*', './package.json'],
    ['./utils/*.mjs', './enums/*']
  ])('should return comparison result (%j, %j)', (a, b) => {
    expect(testSubject(a, b)).toMatchSnapshot()
  })
})
