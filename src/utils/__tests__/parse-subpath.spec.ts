/**
 * @file Unit Tests - parseSubpath
 * @module mlly/utils/tests/unit/parseSubpath
 */

import exports from '#fixtures/package-exports'
import imports from '#fixtures/package-imports'
import type { ParseSubpathOptions, ParsedSubpath } from '#src/interfaces'
import getPackageJson from '#tests/utils/get-package-json'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import type { Exports, Imports } from '@flex-development/pkg-types'
import type { Nullable } from '@flex-development/tutils'
import { pathToFileURL } from 'node:url'
import testSubject from '../parse-subpath'

describe('unit:utils/parseSubpath', () => {
  type Expected = Omit<ParsedSubpath, 'internal' | 'specifier'>

  let pkgname: string
  let options: ParseSubpathOptions

  beforeAll(() => {
    const dir = pathToFileURL('.' + pathe.sep)
    const parent = pathToFileURL('scratch.ts')

    options = { dir, parent }
    pkgname = getPackageJson('package.json')!.name!
  })

  it('should return package import as ParsedSubpath object', () => {
    // Arrange
    const cases: [
      string,
      Imports | undefined,
      ParseSubpathOptions,
      Expected
    ][] = [
      [
        '#mkbuild',
        imports,
        options,
        {
          base: '',
          key: '#mkbuild',
          raw: '#mkbuild',
          target: '@flex-development/mkbuild'
        }
      ],
      [
        '#src',
        imports,
        options,
        {
          base: '',
          key: '#src',
          raw: '#src',
          target: './src/index.ts'
        }
      ],
      [
        '#src/utils',
        imports,
        options,
        {
          base: 'utils',
          key: '#src/*',
          raw: '#src/utils',
          target: './src/*.ts'
        }
      ],
      [
        '#src/utils/parse-subpath',
        imports,
        options,
        {
          base: 'utils/parse-subpath',
          key: '#src/*',
          raw: '#src/utils/parse-subpath',
          target: './src/*.ts'
        }
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, context, options, expected]) => {
      expect(testSubject(specifier, context, options)).to.deep.equal({
        ...expected,
        internal: true,
        specifier
      })
    })
  })

  it('should return package path as ParsedSubpath object', () => {
    // Arrange
    const cases: [
      string,
      Exports | undefined,
      ParseSubpathOptions,
      Expected
    ][] = [
      [
        pkgname,
        exports,
        options,
        {
          base: '',
          key: '.',
          raw: '.',
          target: './dist/index.mjs'
        }
      ],
      [
        pkgname + '/internal',
        exports,
        options,
        {
          base: '',
          key: './internal',
          raw: './internal',
          target: exports['./internal'] as Nullable<string>
        }
      ],
      [
        pkgname + '/internal/resolver',
        exports,
        options,
        {
          base: 'resolver',
          key: './internal/*',
          raw: './internal/resolver',
          target: exports['./internal/*'] as Nullable<string>
        }
      ],
      [
        pkgname + '/package.json',
        exports,
        options,
        {
          base: '',
          key: './package.json',
          raw: './package.json',
          target: './package.json'
        }
      ],
      [
        pkgname + '/utils',
        exports,
        options,
        {
          base: '',
          key: './utils',
          raw: './utils',
          target: exports['./utils'] as Nullable<string>
        }
      ],
      [
        pkgname + '/utils/parse-subpath',
        exports,
        options,
        {
          base: 'parse-subpath',
          key: './utils/*',
          raw: './utils/parse-subpath',
          target: exports['./utils/*'] as Nullable<string>
        }
      ],
      [
        'exports-sugar',
        getPackageJson('__fixtures__/node_modules/exports-sugar')!.exports,
        {
          dir: pathToFileURL('__fixtures__/node_modules/exports-sugar'),
          parent: pathToFileURL('__fixtures__/parent.ts')
        },
        {
          base: '',
          key: '.',
          raw: '.',
          target: './index.mjs'
        }
      ],
      [
        'exports-sugar-a',
        ['./node_modules/foo-pkg/dist/index.mjs', './index.mjs'],
        {
          dir: pathToFileURL('__fixtures__/node_modules/exports-sugar-a'),
          parent: pathToFileURL('__fixtures__/parent.ts')
        },
        {
          base: '',
          key: '.',
          raw: '.',
          target: './index.mjs'
        }
      ],
      [
        'exports-sugar-c',
        getPackageJson('__fixtures__/node_modules/exports-sugar-c')!.exports,
        {
          conditions: ['require'],
          dir: pathToFileURL('__fixtures__/node_modules/exports-sugar-c'),
          parent: pathToFileURL('__fixtures__/parent.ts')
        },
        {
          base: '',
          key: '.',
          raw: '.',
          target: './index.cjs'
        }
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, context, options, expected]) => {
      expect(testSubject(specifier, context, options)).to.deep.equal({
        ...expected,
        internal: false,
        specifier
      })
    })
  })

  describe('throws', () => {
    it('should throw if context contains invalid package targets', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_INVALID_PACKAGE_TARGET
      const target: number = faker.number.int()
      let error: NodeError

      // Act
      try {
        testSubject(pkgname, { '.': target as unknown as string }, options)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').contain(target)
    })

    it('should throw if context contains numeric property keys', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_INVALID_PACKAGE_CONFIG
      const exports: Exports = { import: { '.': './dist/index.mjs', 5: null } }
      let error: NodeError

      // Act
      try {
        testSubject(pkgname, exports, {
          dir: pathToFileURL('__fixtures__/node_modules/exports-sugar-c'),
          parent: pathToFileURL('__fixtures__/parent.ts')
        })
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
    })

    it('should throw if package import is not defined', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_PACKAGE_IMPORT_NOT_DEFINED
      let error: NodeError<TypeError>

      // Act
      try {
        testSubject('#src', undefined, options)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
    })

    it('should throw if package path is not exported', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_PACKAGE_PATH_NOT_EXPORTED
      let error: NodeError

      // Act
      try {
        testSubject(pkgname, {}, options)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
    })

    it('should throw if target has invalid path segments', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_INVALID_PACKAGE_TARGET
      const target: string = './node_modules/foo-pkg/index.mjs'
      let error: NodeError

      // Act
      try {
        testSubject(pkgname, { '.': [target] }, options)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').contain(target)
    })

    it('should throw if target is not relative to package directory', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_INVALID_PACKAGE_TARGET
      const target: string = 'dist/index.mjs'
      let error: NodeError

      // Act
      try {
        testSubject(pkgname, { '.': target }, options)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').contain(target)
      expect(error!).to.have.property('message').endWith('must start with "./"')
    })
  })
})
