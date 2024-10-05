/**
 * @file Unit Tests - toRelativeSpecifier
 * @module mlly/lib/tests/unit/toRelativeSpecifier
 */

import testSubject from '#lib/to-relative-specifier'
import pathe from '@flex-development/pathe'

describe('unit:lib/toRelativeSpecifier', () => {
  it.each<Parameters<typeof testSubject>>([
    [
      pathe.pathToFileURL('src/lib'),
      pathe.pathToFileURL('src/lib/resolve-alias.mts')
    ],
    [pathe.pathToFileURL('src/lib/cwd'), pathe.pathToFileURL('src/lib')],
    [pathe.pathToFileURL('src/lib/to-relative-specifier'), import.meta.url],
    [pathe.pathToFileURL('src/utils'), pathe.pathToFileURL('src/utils')]
  ])('should return relative specifier (%#)', (url, parent) => {
    expect(testSubject(url, parent)).toMatchSnapshot()
  })
})
