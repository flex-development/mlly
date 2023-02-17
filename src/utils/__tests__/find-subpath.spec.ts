/**
 * @file Unit Tests - findSubpath
 * @module mlly/utils/tests/unit/findSubpath
 */

import type { FindSubpathOptions } from '#src/interfaces'
import getPackageJson from '#tests/utils/get-package-json'
import pathe from '@flex-development/pathe'
import type { Exports, Imports, PackageJson } from '@flex-development/pkg-types'
import { pathToFileURL } from 'node:url'
import testSubject from '../find-subpath'

describe('unit:utils/findSubpath', () => {
  let options: FindSubpathOptions
  let pkgjson: PackageJson & { name: string }

  beforeEach(() => {
    options = { dir: pathToFileURL('.' + pathe.sep), parent: import.meta.url }
    pkgjson = getPackageJson('package.json') as typeof pkgjson
  })

  it('should return null if target is not found in context', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[1][] = [
      null,
      undefined,
      faker.number.int() as unknown as Exports,
      pkgjson.exports
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
      ['./dist/index', pkgjson.exports, '.'],
      ['./dist/index.mjs', pkgjson.exports, '.'],
      ['./package.json', pkgjson.exports, './package.json'],
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
      ],
      [
        './utils/find-subpath.mjs',
        {
          './utils': './utils/index.mjs',
          './utils/*': './utils/*.mjs'
        },
        './utils/*'
      ],
      [
        './utils/find-subpath',
        {
          './utils/*': './utils/*.mjs',
          './utils': './utils/index.mjs'
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
