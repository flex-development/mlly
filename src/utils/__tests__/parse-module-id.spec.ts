/**
 * @file Unit Tests - parseModuleId
 * @module mlly/utils/tests/unit/parseModuleId
 */

import type { ParsedModuleId } from '#src/interfaces'
import type { ModuleId } from '#src/types'
import { ErrorCode, type NodeError } from '@flex-development/errnode'
import pathe from '@flex-development/pathe'
import { cast, type Omit } from '@flex-development/tutils'
import { URL, pathToFileURL } from 'node:url'
import testSubject from '../parse-module-id'

describe('unit:utils/parseModuleId', () => {
  type Expect = Omit<ParsedModuleId, 'raw'> & { path?: string }

  it('should return absolute specifier as ParsedModuleId object', () => {
    // Arrange
    const cases: [...Parameters<typeof testSubject>, Expect][] = [
      [
        'c:/home/dir/file.txt',
        undefined,
        {
          internal: false,
          path: 'c:/home/dir/file.txt',
          pkg: '',
          protocol: '',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ],
      [
        process.cwd(),
        undefined,
        {
          internal: false,
          path: process.cwd(),
          pkg: '',
          protocol: '',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, options = {}, expected]) => {
      expect(testSubject(specifier, options)).to.eql({
        ...expected,
        raw: cast(specifier)
      })
    })
  })

  it('should return bare specifier as ParsedModuleId object', () => {
    // Arrange
    const cases: [...Parameters<typeof testSubject>, Expect][] = [
      [
        '@flex-development/mkbuild/package.json',
        { pkgname: true },
        {
          internal: false,
          path: './package.json',
          pkg: '@flex-development/mkbuild',
          protocol: '',
          scope: '@flex-development',
          version: '',
          version_prefix: ''
        }
      ],
      [
        '@flex-development/mlly',
        { pkgname: true },
        {
          internal: false,
          path: '.',
          pkg: '@flex-development/mlly',
          protocol: '',
          scope: '@flex-development',
          version: '',
          version_prefix: ''
        }
      ],
      [
        'foo-package@v1.0.0-beta.1/dist/index.mjs',
        { pkgname: true },
        {
          internal: false,
          path: './dist/index.mjs',
          pkg: 'foo-package',
          protocol: '',
          scope: '',
          version: '1.0.0-beta.1',
          version_prefix: 'v'
        }
      ],
      [
        'mlly@1.0.0',
        { pkgname: true },
        {
          internal: false,
          path: '.',
          pkg: 'mlly',
          protocol: '',
          scope: '',
          version: '1.0.0',
          version_prefix: ''
        }
      ],
      [
        'node_modules/@flex-development/mlly/dist/index.mjs',
        undefined,
        {
          internal: false,
          path: 'node_modules/@flex-development/mlly/dist/index.mjs',
          pkg: '',
          protocol: '',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, options = {}, expected]) => {
      expect(testSubject(specifier, options)).to.eql({
        ...expected,
        raw: cast(specifier)
      })
    })
  })

  it('should return builtin specifier as ParsedModuleId object', () => {
    // Arrange
    const cases: [...Parameters<typeof testSubject>, Expect][] = [
      [
        'fs',
        undefined,
        {
          internal: false,
          path: '',
          pkg: 'node:fs',
          protocol: '',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ],
      [
        'node:fs',
        undefined,
        {
          internal: false,
          path: '',
          pkg: 'node:fs',
          protocol: 'node:',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ],
      [
        'node:fs/promises',
        undefined,
        {
          internal: false,
          path: '/promises',
          pkg: 'node:fs',
          protocol: 'node:',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, options = {}, expected]) => {
      expect(testSubject(specifier, options)).to.eql({
        ...expected,
        raw: cast(specifier)
      })
    })
  })

  it('should return internal specifier as ParsedModuleId object', () => {
    // Arrange
    const cases: [...Parameters<typeof testSubject>, Expect][] = [
      [
        '#src',
        { internal: true },
        {
          internal: true,
          path: '#src',
          pkg: '#src',
          protocol: '',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ],
      [
        '#src/utils',
        { internal: true },
        {
          internal: true,
          path: '#src/utils',
          pkg: '#src',
          protocol: '',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, options = {}, expected]) => {
      expect(testSubject(specifier, options)).to.eql({
        ...expected,
        raw: cast(specifier)
      })
    })
  })

  it('should return relative specifier as ParsedModuleId object', () => {
    // Arrange
    const cases: [...Parameters<typeof testSubject>, Expect][] = [
      [
        '../dist/index.mjs',
        undefined,
        {
          internal: false,
          path: '../dist/index.mjs',
          pkg: '',
          protocol: '',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ],
      [
        './package.json',
        undefined,
        {
          internal: false,
          path: './package.json',
          pkg: '',
          protocol: '',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, options = {}, expected]) => {
      expect(testSubject(specifier, options)).to.eql({
        ...expected,
        raw: cast(specifier)
      })
    })
  })

  it('should return url specifier as ParsedModuleId object', () => {
    // Arrange
    const cases: [...Parameters<typeof testSubject>, Expect][] = [
      [
        'data:text/javascript;base64,SGVsbG8sIFdvcmxkIQ==',
        undefined,
        {
          internal: false,
          path: 'text/javascript;base64,SGVsbG8sIFdvcmxkIQ==',
          pkg: '',
          protocol: 'data:',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ],
      [
        'https://deno.land:8080/std@0.171.0/types.d.ts',
        undefined,
        {
          internal: false,
          path: 'deno.land:8080/std@0.171.0/types.d.ts',
          pkg: '',
          protocol: 'https:',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ],
      [
        import.meta.url,
        undefined,
        {
          internal: false,
          path: import.meta.url.slice(7),
          pkg: '',
          protocol: 'file:',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ],
      [
        new URL('package.json', pathToFileURL('.' + pathe.sep)),
        undefined,
        {
          internal: false,
          path: process.cwd() + '/package.json',
          pkg: '',
          protocol: 'file:',
          scope: '',
          version: '',
          version_prefix: ''
        }
      ]
    ]

    // Act + Expect
    cases.forEach(([specifier, options = {}, expected]) => {
      expect(testSubject(specifier, options)).to.eql({
        ...expected,
        raw: specifier instanceof URL ? specifier.href : specifier
      })
    })
  })

  describe('throws', () => {
    let code: ErrorCode
    let parent: ModuleId

    beforeEach(() => {
      code = ErrorCode.ERR_INVALID_MODULE_SPECIFIER
      parent = import.meta.url
    })

    it('should throw if id contains encoded separators', () => {
      // Arrange
      const message: RegExp = /must not include encoded '\/' or '\\' characters/
      let error!: NodeError<TypeError>

      // Act
      try {
        testSubject('.%2Futils', { parent })
      } catch (e: unknown) {
        error = cast(e)
      }

      // Expect
      expect(error).to.have.property('code', code)
      expect(error).to.have.property('message').match(message)
    })

    it('should throw if id does not begin with valid package name', () => {
      // Arrange
      const message: RegExp = /does not start with a valid package name/
      let error!: NodeError<TypeError>

      // Act
      try {
        testSubject('@FLEX-DEVELOPMENT/MLLY', { parent, pkgname: true })
      } catch (e: unknown) {
        error = cast(e)
      }

      // Expect
      expect(error).to.have.property('code', code)
      expect(error).to.have.property('message').match(message)
    })

    it('should throw if id is invalid for unknown reason', () => {
      // Arrange
      const message: RegExp = /^Invalid module '' imported from \S+/
      let error!: NodeError<TypeError>

      // Act
      try {
        testSubject('', { parent })
      } catch (e: unknown) {
        error = cast(e)
      }

      // Expect
      expect(error).to.have.property('code', code)
      expect(error).to.have.property('message').match(message)
    })

    it('should throw if id is invalid url', () => {
      // Arrange
      const message: RegExp = /is not a valid URL/
      let error!: NodeError<TypeError>

      // Act
      try {
        testSubject('https:', { parent })
      } catch (e: unknown) {
        error = cast(e)
      }

      // Expect
      expect(error).to.have.property('code', code)
      expect(error).to.have.property('message').match(message)
    })

    it('should throw if id is not internal specifier', () => {
      // Arrange
      const cases: Parameters<typeof testSubject>[] = [['#/'], ['#src/utils/']]
      const message: RegExp = /is not a valid internal imports specifier name/

      // Act + Expect
      cases.forEach(([id]) => {
        let error!: NodeError<TypeError>

        try {
          testSubject(id, { internal: true, parent })
        } catch (e: unknown) {
          error = cast(e)
        }

        // Expect
        expect(error).to.have.property('code', code)
        expect(error).to.have.property('message').match(message)
      })
    })
  })
})
