/**
 * @file Unit Tests - toRelativeSpecifier
 * @module mlly/lib/tests/unit/toRelativeSpecifier
 */

import testSubject from '#lib/to-relative-specifier'
import type { ModuleId } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

describe('unit:lib/toRelativeSpecifier', () => {
  it.each<[...Parameters<typeof testSubject>, (ModuleId)?]>([
    [
      import.meta.url,
      import.meta.url
    ],
    [
      pathe.pathToFileURL('src/lib/to-relative-specifier.mts'),
      import.meta.url
    ],
    [
      pathe.pathToFileURL('src/lib/is-module-id.mts'),
      pathe.pathToFileURL('src/lib/index.mts')
    ],
    [
      pathe.pathToFileURL('src/lib/lookup-package-scope.mts'),
      pathe.pathToFileURL('src/lib/')
    ],
    [
      pathe.pathToFileURL('src/lib'),
      pathe.pathToFileURL('src/lib/default-conditions.mts'),
      pathe.pathToFileURL('src/lib/')
    ],
    [
      pathe.pathToFileURL('__fixtures__/conditions.mts'),
      pathe.pathToFileURL('src/lib/__tests__/resolver.spec.mts')
    ]
  ])('should return relative specifier (%#)', (url, parent, expected = url) => {
    // Act
    const result = testSubject(url, parent)

    // Expect
    expect(String(new URL(result, parent))).to.eq(String(expected))
  })
})
