/**
 * @file Unit Tests - Resolver
 * @module mlly/internal/tests/unit/Resolver
 */

import regexp from '#src/internal/escape-reg-exp'
import type { ModuleId } from '#src/types'
import getPackageJson from '#tests/utils/get-package-json'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import type { Exports } from '@flex-development/pkg-types'
import { URL, pathToFileURL } from 'node:url'
import TestSubject from '../resolver'

vi.mock('#src/utils/lookup-package-scope')

describe('unit:internal/Resolver', () => {
  let parent: ModuleId
  let subject: TestSubject
  let url: (input: string) => URL

  beforeAll(() => {
    url = (input: string): URL => {
      input = `__fixtures__/node_modules/${input.replace(/^\.\//, '')}`
      return new URL(input, pathToFileURL('.' + pathe.sep))
    }

    parent = pathToFileURL('__fixtures__/parent.ts').href
    subject = new TestSubject()
  })

  describe('#resolveModule', () => {
    it('should return module URL', () => {
      // Arrange
      const cases: [string, ModuleId, URL][] = [
        ['#src', pathToFileURL('scratch.ts'), pathToFileURL('src/index.ts')],
        [
          '@flex-development/pkg-types',
          pathToFileURL('src/utils/read-package-json.ts'),
          pathToFileURL(
            'node_modules/@flex-development/pkg-types/dist/index.d.mts'
          )
        ],
        [
          'fs',
          pathToFileURL('src/internal/is-directory.ts'),
          new URL('node:fs')
        ],
        [
          'node:assert',
          pathToFileURL('src/utils/compare-subpaths.ts'),
          new URL('node:assert')
        ],
        [
          '../resolver.ts',
          import.meta.url,
          pathToFileURL('src/internal/resolver.ts')
        ],
        [
          './validate-exports.ts',
          pathToFileURL('src/utils/is-exports-sugar.ts'),
          pathToFileURL('src/utils/validate-exports.ts')
        ],
        [import.meta.url, 'https://cdn.example.com', new URL(import.meta.url)],
        [import.meta.url, import.meta.url, new URL(import.meta.url)],
        [
          pathe.resolve('package.json'),
          import.meta.url,
          pathToFileURL('package.json')
        ]
      ]

      // Act + Expect
      cases.forEach(([specifier, parent, expected]) => {
        expect(subject.resolveModule(specifier, parent)).to.deep.equal(expected)
      })
    })

    it('should throw if module URL is directory URL', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_UNSUPPORTED_DIR_IMPORT
      const dir_re: RegExp = new RegExp(regexp(pathe.resolve('src')))
      let error: NodeError

      // Act
      try {
        subject.resolveModule('./src', pathToFileURL('scratch.ts'))
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(dir_re)
    })

    it('should throw if module URL is missing file URL', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_MODULE_NOT_FOUND
      const file: string = 'src/internal/resolver.mjs'
      const file_re: RegExp = new RegExp(regexp(pathe.resolve(file)))
      let error: NodeError

      // Act
      try {
        subject.resolveModule('../resolver.mjs', import.meta.url)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(file_re)
    })
  })

  describe('#resolvePackage', () => {
    it('should return package path URL', () => {
      // Arrange
      const cases: [string, ModuleId, URL][] = [
        ['exports-sugar', parent, url('exports-sugar/index.mjs')],
        ['exports-sugar-a', parent, url('exports-sugar-a/index.mjs')],
        ['exports-sugar-c', parent, url('exports-sugar-c/index.mjs')],
        ['fs', parent, new URL('node:fs')],
        ['legacy-main-1', parent, url('legacy-main-1/index.js')],
        ['legacy-main-1/utils', parent, url('legacy-main-1/utils')],
        [
          '@flex-development/mlly',
          import.meta.url,
          pathToFileURL('dist/index.mjs')
        ]
      ]

      // Act + Expect
      cases.forEach(([specifier, parent, expected]) => {
        const result = subject.resolvePackage(specifier, parent)

        expect(result).to.deep.equal(expected)
      })
    })

    it('should throw if package path was not resolved', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_MODULE_NOT_FOUND
      let error: NodeError

      // Act
      try {
        subject.resolvePackage('foo-package/lib', parent)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
    })
  })

  describe('#resolvePackageExport', () => {
    let pkg: URL

    beforeAll(() => {
      pkg = url('exports-map-1/package.json')
    })

    it('should return package export URL', () => {
      // Arrange
      const cases: [string, URL][] = [
        ['exports-map-1', url('exports-map-1/index.mjs')],
        ['exports-map-1/lib', url('exports-map-1/lib/index.mjs')],
        ['exports-map-1/lib/utils', url('exports-map-1/lib/utils.mjs')],
        ['exports-map-1/main', url('exports-map-1/main.mjs')]
      ]

      // Act + Expect
      cases.forEach(([specifier, expected]) => {
        const result = subject.resolvePackageExport(specifier, pkg, parent)

        expect(result).to.deep.equal(expected)
      })
    })

    it('should throw if package export was not resolved', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_PACKAGE_PATH_NOT_EXPORTED
      const subpath_re: RegExp = /'\.\/internal'/
      let error: NodeError

      // Act
      try {
        subject.resolvePackageExport('exports-map-1/internal', pkg, parent)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(subpath_re)
    })
  })

  describe('#resolvePackageImport', () => {
    it('should return package import URL', () => {
      // Arrange
      const cases: [string, URL][] = [
        ['#src', pathToFileURL('src/index.ts')],
        ['#src/internal/resolver', pathToFileURL('src/internal/resolver.ts')],
        [
          '#mkbuild',
          pathToFileURL('node_modules/@flex-development/mkbuild/dist/index.mjs')
        ]
      ]

      // Act + Expect
      cases.forEach(([specifier, expected]) => {
        const result = subject.resolvePackageImport(specifier, import.meta.url)

        expect(result).to.deep.equal(expected)
      })
    })

    it('should throw if package import was not resolved', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_PACKAGE_IMPORT_NOT_DEFINED
      const parent: URL = pathToFileURL(faker.system.filePath())
      const subpath_re: RegExp = /'#app'/
      let error: NodeError

      // Act
      try {
        subject.resolvePackageImport('#app', parent)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(subpath_re)
    })
  })

  describe('#resolvePackageMain', () => {
    it('should return package entry point URL', () => {
      // Arrange
      const cases: [ModuleId, URL][] = [
        [url('legacy-main-1/package.json'), url('legacy-main-1/index.js')],
        [url('legacy-main-2/package.json'), url('legacy-main-2/index.json')]
      ]

      // Act + Expect
      cases.forEach(([pkg, expected]) => {
        const result = subject.resolvePackageMain(
          pkg,
          getPackageJson(pkg),
          parent
        )

        expect(result).to.deep.equal(expected)
      })
    })

    it('should throw if package entry point was not resolved', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_MODULE_NOT_FOUND
      let error: NodeError

      // Act
      try {
        subject.resolvePackageMain(url('foo-package/package.json'), {}, parent)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
    })
  })

  describe('#resolvePackageTarget', () => {
    let dir: URL
    let key: string

    beforeAll(() => {
      dir = pathToFileURL('__fixtures__/node_modules/foo-package/')
      key = '.'
    })

    it('should throw if subpath contains invalid path segments', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_INVALID_MODULE_SPECIFIER
      const cases: [string, string, string, boolean, RegExp][] = [
        [
          './__fixtures__/*',
          'node_modules/exports-map-1',
          '#fixtures/*',
          true,
          /'#fixtures\/node_modules\/exports-map-1' .+ "#fixtures\/\*" for the "imports" resolution/
        ],
        [
          './dist/utils/index.mjs',
          'node_modules/foo-pkg/utils',
          './utils/*',
          false,
          /'\.\/utils\/node_modules\/foo-pkg\/utils' .+ "\.\/utils\/\*" for the "exports" resolution/
        ]
      ]

      // Act + Expect
      cases.forEach(([target, subpath, key, internal, message_re]) => {
        const pkg: string = dir.pathname + 'package.json'
        const request_re: RegExp = /request is not a valid match in pattern/
        let error: NodeError

        try {
          subject.resolvePackageTarget(
            dir,
            target,
            subpath,
            key,
            parent,
            internal
          )
        } catch (e: unknown) {
          error = e as typeof error
        }

        expect(error!).to.not.be.undefined
        expect(error!).to.have.property('code').equal(code)
        expect(error!).to.have.property('message').match(request_re)
        expect(error!).to.have.property('message').match(message_re)
        expect(error!).to.have.property('message').include(pkg)
      })
    })

    it('should throw if subpath pattern configuration is invalid', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_INVALID_PACKAGE_TARGET
      const target: string = './dist/lib/*.mjs'
      const target_re: RegExp = new RegExp(`"${regexp(target)}"`)
      let error: NodeError

      // Act
      try {
        subject.resolvePackageTarget(dir, target, '/index', key, parent)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(target_re)
    })

    it('should throw if target contains invalid path segments', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_INVALID_PACKAGE_TARGET
      const target: string = './node_modules/foo-package/dist/index.mjs'
      const target_re: RegExp = new RegExp(`"${target}"`)
      let error: NodeError

      // Act
      try {
        subject.resolvePackageTarget(dir, target, '', key, parent)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(target_re)
    })

    it('should throw if target contains numeric property keys', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_INVALID_PACKAGE_CONFIG
      const message: RegExp = /"exports" cannot contain numeric property keys/
      let error: NodeError

      // Act
      try {
        subject.resolvePackageTarget(dir, { '5': null }, '', key, parent)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(message)
    })

    it('should throw if target does not begin with "./"', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_INVALID_PACKAGE_TARGET
      const target_re: RegExp = new RegExp(`"${regexp(import.meta.url)}"`)
      let error: NodeError

      // Act
      try {
        subject.resolvePackageTarget(dir, import.meta.url, '', key, parent)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(target_re)
    })

    it('should throw if target schema is invalid', () => {
      // Arrange
      const code: ErrorCode = ErrorCode.ERR_INVALID_PACKAGE_TARGET
      const target: number = faker.number.int()
      const target_re: RegExp = new RegExp(regexp(JSON.stringify(target)))
      let error: NodeError

      // Act
      try {
        subject.resolvePackageTarget(
          dir,
          [target] as unknown as Exports,
          '',
          key,
          parent
        )
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error!).to.not.be.undefined
      expect(error!).to.have.property('code').equal(code)
      expect(error!).to.have.property('message').match(target_re)
    })
  })
})
