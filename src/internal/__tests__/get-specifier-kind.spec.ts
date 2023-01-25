/**
 * @file Unit Tests - getSpecifierKind
 * @module mlly/internal/tests/unit/getSpecifierKind
 */

import { SpecifierKind } from '#src/enums'
import type { Nullable } from '@flex-development/tutils'
import testSubject from '../get-specifier-kind'

describe('unit:internal/getSpecifierKind', () => {
  it('should return SpecifierKind or null', () => {
    // Arrange
    const cases: [string, Nullable<SpecifierKind>][] = [
      ['', null],
      [' ', null],
      ['#src/enums', SpecifierKind.BARE],
      ['@flex-development/mlly', SpecifierKind.BARE],
      ['../get-specifier-kind', SpecifierKind.RELATIVE],
      [`'#src/enums'`, SpecifierKind.BARE],
      [`"${import.meta.url}"`, SpecifierKind.ABSOLUTE],
      [import.meta.url, SpecifierKind.ABSOLUTE]
    ]

    // Act + Expect
    cases.forEach(([specifier, expected]) => {
      expect(testSubject(specifier)).to.equal(expected)
    })
  })
})
