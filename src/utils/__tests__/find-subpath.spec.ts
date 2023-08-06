/**
 * @file Unit Tests - findSubpath
 * @module mlly/utils/tests/unit/findSubpath
 */

import exports from '#fixtures/package-exports'
import type { FindSubpathOptions } from '#src/interfaces'
import pathe from '@flex-development/pathe'
import type { Exports, Imports } from '@flex-development/pkg-types'
import { DOT, type Nilable } from '@flex-development/tutils'
import { pathToFileURL } from 'node:url'
import testSubject from '../find-subpath'

describe('unit:utils/findSubpath', () => {
  let options: FindSubpathOptions

  beforeAll(() => {
    options = { dir: pathToFileURL(DOT + pathe.sep), parent: import.meta.url }
  })

  it('should return null if target is not found in context', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[1][] = [, null, exports]

    // Act + Expect
    cases.forEach(context => {
      expect(testSubject('./index.mjs', context, options)).to.be.null
    })
  })

  it('should return defined subpath if target is found in context', () => {
    // Arrange
    const cases: [string, Nilable<Exports | Imports>, string][] = [
      ['./dist/index', './dist/index.mjs', DOT],
      ['./dist/index.mjs', './dist/index.mjs', DOT],
      ['./dist/index.mjs', ['./dist/index.mjs'], DOT],
      ['./dist/index', exports, DOT],
      ['./dist/index.mjs', exports, DOT],
      ['./package.json', exports, './package.json'],
      ['./dist/utils', exports, './utils'],
      ['./dist/utils/index', exports, './utils'],
      ['./dist/utils/index.mjs', exports, './utils'],
      ['./dist/utils/find-subpath', exports, './utils/*'],
      ['./dist/utils/find-subpath.mjs', exports, './utils/*'],
      [
        './dist/index.mjs',
        {
          import: './dist/index.mjs',
          require: './dist/index.cjs'
        },
        DOT
      ],
      [
        './dist/utils/conditions.mjs',
        {
          './utils': {
            default: './dist/utils/index.mjs',
            require: './dist/utils/index.cjs'
          },
          './utils/*': {
            default: './dist/utils/*.mjs',
            require: './dist/utils/*.cjs'
          }
        },
        './utils/*'
      ]
    ]

    // Act + Expect
    cases.forEach(([target, context, expected]) => {
      expect(testSubject(target, context, options)).to.equal(expected)
    })
  })
})
