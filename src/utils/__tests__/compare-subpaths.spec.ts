/**
 * @file Unit Tests - compareSubpaths
 * @module mlly/utils/tests/unit/compareSubpaths
 */

import { CompareResult } from '@flex-development/tutils'
import testSubject from '../compare-subpaths'

describe('unit:utils/compareSubpaths', () => {
  it('should return comparison result', () => {
    // Arrange
    const cases: [...Parameters<typeof testSubject>, CompareResult][] = [
      ['*', '*', CompareResult.EQUAL],
      ['./lib/*', './enums', CompareResult.LESS_THAN],
      ['./enums', './utils', CompareResult.GREATER_THAN],
      ['./constants', './utils/*', CompareResult.LESS_THAN],
      ['./utils/*.mjs', './enums/*', CompareResult.LESS_THAN],
      ['./package.json', './constants', CompareResult.LESS_THAN],
      ['./enums/*', './utils/*.mjs', CompareResult.GREATER_THAN],
      ['./utils/*', './package.json', CompareResult.GREATER_THAN]
    ]

    // Act + Expect
    cases.forEach(([subpath1, subpath2, expected]) => {
      expect(testSubject(subpath1, subpath2)).to.equal(expected)
    })
  })
})
