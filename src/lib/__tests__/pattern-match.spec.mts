/**
 * @file Unit Tests - patternMatch
 * @module mlly/lib/tests/unit/patternMatch
 */

import testSubject from '#lib/pattern-match'
import subpathExports from '#node_modules/subpath-exports/package.json'
import pkg from '@flex-development/mlly/package.json'

describe('unit:lib/patternMatch', () => {
  it.each<Parameters<typeof testSubject>>([
    ['#lib/pattern-match', pkg.imports],
    ['./lib/a.js', subpathExports.exports],
    ['./package.json', pkg.exports]
  ])('should return `PatternMatch` if subpath pattern match is found (%#)', (
    matchKey,
    matchObject
  ) => {
    // Act
    const result = testSubject(matchKey, matchObject)

    // Expect
    expect(result).to.be.an('array').of.length(2)
    expect(result).toMatchSnapshot()
  })

  it.each<Parameters<typeof testSubject>>([
    ['#internal/chars', null],
    ['#node_modules/exports-sugar-a/package.json', pkg.imports]
  ])('should return `null` if subpath pattern match is not found (%#)', (
    matchKey,
    matchObject
  ) => {
    expect(testSubject(matchKey, matchObject)).to.be.null
  })
})
