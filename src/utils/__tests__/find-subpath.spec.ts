/**
 * @file Unit Tests - findSubpath
 * @module mlly/utils/tests/unit/findSubpath
 */

import type { FindSubpathOptions } from '#src/interfaces'
import pathe from '@flex-development/pathe'
import type { Exports, Imports } from '@flex-development/pkg-types'
import { pathToFileURL } from 'node:url'
import testSubject from '../find-subpath'

describe('unit:utils/findSubpath', () => {
  let exports: Exports
  let options: FindSubpathOptions

  beforeAll(() => {
    options = { dir: pathToFileURL('.' + pathe.sep), parent: import.meta.url }
    exports = {
      '.': './dist/index.mjs',
      './package.json': './package.json',
      './utils': './dist/utils/index.mjs',
      './utils/*': './dist/utils/*.mjs'
    }
  })

  it('should return null if target is not found in context', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[1][] = [
      exports,
      faker.number.int() as unknown as Exports,
      null,
      undefined
    ]

    // Act + Expect
    cases.forEach(context => {
      expect(testSubject('./index.mjs', context, options)).to.be.null
    })
  })

  it('should return defined subpath if target is found in context', () => {
    // Arrange
    const cases: [string, Exports | Imports | undefined, string][] = [
      ['./dist/index', './dist/index.mjs', '.'],
      ['./dist/index.mjs', './dist/index.mjs', '.'],
      ['./dist/index.mjs', ['./dist/index.mjs'], '.'],
      ['./dist/index', exports, '.'],
      ['./dist/index.mjs', exports, '.'],
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
        '.'
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
