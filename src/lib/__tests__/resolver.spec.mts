/**
 * @file Unit Tests - resolve
 * @module mlly/lib/tests/unit/resolve
 */

import fixtureConditions from '#fixtures/conditions'
import parent from '#fixtures/parent'
import chars from '#internal/chars'
import cwd from '#lib/cwd'
import defaultConditions from '#lib/default-conditions'
import * as testSubject from '#lib/resolver'
import exportsSugarA from '#node_modules/exports-sugar-a/package.json'
import exportsSugar from '#node_modules/exports-sugar/package.json'
import legacyMain1 from '#node_modules/legacy-main-1/package.json'
import legacyMain2 from '#node_modules/legacy-main-2/package.json'
import subpathExports from '#node_modules/subpath-exports/package.json'
import toPackageUrl from '#tests/utils/to-package-url'
import {
  codes,
  isNodeError,
  type Code,
  type NodeError
} from '@flex-development/errnode'
import errnode from '@flex-development/errnode/package.json'
import type { MainField } from '@flex-development/mlly'
import pkg from '@flex-development/mlly/package.json'
import { dot, pathToFileURL, resolve, sep } from '@flex-development/pathe'
import type { Condition, PackageJson } from '@flex-development/pkg-types'
import * as baseline from 'import-meta-resolve'

describe('unit:lib/resolver', () => {
  describe('legacyMainResolve', () => {
    it('should throw if main entry point is not found', async () => {
      // Arrange
      let error!: NodeError

      // Act
      try {
        await testSubject.legacyMainResolve(
          toPackageUrl(pkg.name),
          pkg as PackageJson,
          new Set(['unpkg'] as unknown as MainField[]),
          parent
        )
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', codes.ERR_MODULE_NOT_FOUND)
      expect(error).to.not.have.property('url')
      expect(error.message).toMatchSnapshot()
    })
  })

  describe('moduleResolve', () => {
    it.each<Parameters<(typeof testSubject)['moduleResolve']>>([
      ['#internal/fs', import.meta.url, fixtureConditions],
      ['#internal/fs', import.meta.url, ['browser', ...fixtureConditions]],
      [
        '#internal/path/posix',
        pathToFileURL('__fixtures__/node_modules/subpath-imports/index.mjs')
      ],
      [
        '#internal/path/windows',
        pathToFileURL('__fixtures__/node_modules/subpath-imports/main.mjs'),
        new Set<Condition>(['browser'])
      ],
      ['#lib/resolver', import.meta.url, fixtureConditions],
      ['../resolver.mts', import.meta.url],
      ['@flex-development/mkbuild', pathToFileURL('build.config.mts')],
      ['fs', import.meta.url],
      ['node:fs/promises', import.meta.url],
      ['node:url', import.meta.url],
      ['vitest', import.meta.url],
      [String(pathToFileURL('src/lib/index.mts')), import.meta.url],
      [errnode.name, import.meta.url],
      [exportsSugar.name, parent],
      [exportsSugarA.name, parent],
      [legacyMain1.name + '/a.js', parent],
      [legacyMain1.name, parent],
      [legacyMain2.name, parent],
      [pkg.name + '/package.json', import.meta.url],
      [resolve('src/index.mts'), import.meta.url],
      [subpathExports.name + '/lib/a', parent],
      [subpathExports.name + '/lib/a.js', parent]
    ])('should return resolved URL (%#)', async (
      specifier,
      parent,
      conditions,
      mainFields,
      preserveSymlinks,
      fs
    ) => {
      // Arrange
      const expected: URL = baseline.moduleResolve(
        specifier,
        new URL(parent),
        new Set(conditions ?? defaultConditions)
      )

      // Act
      const result = await testSubject.moduleResolve(
        specifier,
        parent,
        conditions,
        mainFields,
        preserveSymlinks,
        fs
      )

      // Expect
      expect(result).to.eql(expected)
      expect(result).toMatchSnapshot()
    })

    it('should throw if `specifier` contains encoded separators', async () => {
      // Arrange
      let error!: NodeError

      // Act
      try {
        await testSubject.moduleResolve(
          sep + 'lib%2futils.mjs',
          import.meta.url
        )
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', codes.ERR_INVALID_MODULE_SPECIFIER)
      expect(error.message).toMatchSnapshot()
    })

    it('should throw if `specifier` resolves to a directory', async () => {
      // Arrange
      const specifier: string = resolve('src') + sep
      let error!: NodeError

      // Act
      try {
        await testSubject.moduleResolve(specifier, import.meta.url)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', codes.ERR_UNSUPPORTED_DIR_IMPORT)
      expect(error).to.have.property('url', String(pathToFileURL(specifier)))
      expect(error.message).toMatchSnapshot()
    })

    it('should throw if `specifier` resolves to missing file', async () => {
      // Arrange
      const specifier: string = resolve('src/index.ts')
      let error!: NodeError

      // Act
      try {
        await testSubject.moduleResolve(specifier, import.meta.url)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', codes.ERR_MODULE_NOT_FOUND)
      expect(error).to.have.property('url', String(pathToFileURL(specifier)))
      expect(error.message).toMatchSnapshot()
    })

    it.each<Parameters<(typeof testSubject)['moduleResolve']>>([
      [
        './relative',
        'data:text/javascript,export default import.meta.resolve("./relative")'
      ],
      [
        'not-builtin',
        'data:text/javascript,export default import.meta.resolve("not-builtin")'
      ]
    ])('should throw if module referrer is invalid (%#)', async (
      specifier,
      parent,
      conditions,
      mainFields,
      preserveSymlinks,
      fs
    ) => {
      // Arrange
      const code: Code = codes.ERR_UNSUPPORTED_RESOLVE_REQUEST
      let error!: NodeError

      // Act
      try {
        await testSubject.moduleResolve(
          specifier,
          parent,
          conditions,
          mainFields,
          preserveSymlinks,
          fs
        )
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', code)
      expect(error.message).toMatchSnapshot()
    })
  })

  describe('packageExportsResolve', () => {
    it('should throw if `exports` object is invalid', async () => {
      // Arrange
      let error!: NodeError

      // Act
      try {
        await testSubject.packageExportsResolve(
          cwd(),
          dot,
          { [dot]: './dist/index.mjs', 'ts-node': './src/index.mts' },
          null,
          import.meta.url
        )
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', codes.ERR_INVALID_PACKAGE_CONFIG)
      expect(error.message).toMatchSnapshot()
    })

    it('should throw if package path is not exported', async () => {
      // Arrange
      const code: Code = codes.ERR_PACKAGE_PATH_NOT_EXPORTED
      let error!: NodeError

      // Act
      try {
        await testSubject.packageExportsResolve(
          cwd(),
          './utils',
          pkg.exports,
          null,
          import.meta.url
        )
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', code)
      expect(error.message).toMatchSnapshot()
    })
  })

  describe('packageImportsResolve', () => {
    it('should throw if package import is not defined', async () => {
      // Arrange
      const code: Code = codes.ERR_PACKAGE_IMPORT_NOT_DEFINED
      let error!: NodeError

      // Act
      try {
        await testSubject.packageImportsResolve('#mocks', import.meta.url)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', code)
      expect(error.message).toMatchSnapshot()
    })

    it.each<string>([
      chars.hash,
      chars.hash + sep,
      pkg.name
    ])('should throw if `specifier` is invalid (%#)', async specifier => {
      // Arrange
      let error!: NodeError

      // Act
      try {
        await testSubject.packageImportsResolve(specifier, import.meta.url)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', codes.ERR_INVALID_MODULE_SPECIFIER)
      expect(error.message).toMatchSnapshot()
    })
  })

  describe('packageResolve', () => {
    it('should throw if `specifier` cannot be resolved', async () => {
      // Arrange
      let error!: NodeError

      // Act
      try {
        await testSubject.packageResolve('missing-package', parent)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', codes.ERR_MODULE_NOT_FOUND)
      expect(error.message).toMatchSnapshot()
    })

    it.each<Parameters<(typeof testSubject)['packageResolve']>>([
      ['@flex-development\\errnode', import.meta.url],
      [chars.at, import.meta.url]
    ])('should throw if `specifier` is invalid (%#)', async (
      specifier,
      parent
    ) => {
      // Arrange
      let error!: NodeError

      // Act
      try {
        await testSubject.packageResolve(specifier, parent)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', codes.ERR_INVALID_MODULE_SPECIFIER)
      expect(error.message).toMatchSnapshot()
    })
  })

  describe('packageSelfResolve', () => {
    it('should return `undefined` if package scope is not found', async () => {
      // Arrange
      const parent: URL = pathToFileURL('../loader.mjs')

      // Act
      const result = await testSubject.packageSelfResolve(pkg.name, dot, parent)

      // Expect
      expect(result).to.be.undefined
    })
  })

  describe('packageTargetResolve', () => {
    it('should throw if `patternMatch` contains invalid segments', async () => {
      // Arrange
      let error!: NodeError

      // Act
      try {
        await testSubject.packageTargetResolve(
          toPackageUrl('invalid-pattern-match'),
          './__fixtures__/*',
          '#fixtures/*',
          'node_modules/legacy-main-1/package.json',
          true,
          null,
          null,
          import.meta.url
        )
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', codes.ERR_INVALID_MODULE_SPECIFIER)
    })

    it('should throw if package config is invalid', async () => {
      // Arrange
      let error!: NodeError

      // Act
      try {
        await testSubject.packageTargetResolve(
          toPackageUrl('invalid-package-config'),
          [{ 13: null }],
          dot,
          null,
          false,
          null,
          null,
          import.meta.url
        )
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', codes.ERR_INVALID_PACKAGE_CONFIG)
      expect(error.message).toMatchSnapshot()
    })

    it.each<Parameters<(typeof testSubject)['packageTargetResolve']>>([
      [
        String(toPackageUrl('invalid-target')) + dot.repeat(2) + sep,
        './index.mjs',
        dot,
        null,
        false,
        null,
        null,
        import.meta.url
      ],
      [
        toPackageUrl('invalid-target'),
        './__fixtures__/node_modules/*',
        '#node_modules/*',
        'legacy-main-2/package.json',
        true,
        null,
        null,
        import.meta.url
      ],
      [
        toPackageUrl('invalid-target'),
        'fs',
        './fs',
        null,
        false,
        null,
        null,
        import.meta.url
      ],
      [
        toPackageUrl('invalid-target'),
        'https://esm.sh/@flex-development/pathe',
        '#internal/pathe',
        null,
        true,
        null,
        null,
        import.meta.url
      ],
      [
        toPackageUrl('invalid-target'),
        dot.repeat(2) + sep + 'fs.browser.mjs',
        '#internal/fs',
        null,
        true,
        null,
        null,
        import.meta.url
      ],
      [
        toPackageUrl('invalid-target'),
        sep + 'os.browser.mjs',
        '#internal/os',
        null,
        true,
        null,
        null,
        import.meta.url
      ],
      [
        toPackageUrl('invalid-target'),
        [undefined, [13], [{}], {}],
        dot,
        null,
        false,
        null,
        null,
        import.meta.url
      ]
    ])('should throw if package target is invalid (%#)', async (
      packageUrl,
      target,
      subpath,
      patternMatch,
      isImports,
      conditions,
      mainFields,
      parent,
      fs
    ) => {
      // Arrange
      let error!: NodeError

      // Act
      try {
        await testSubject.packageTargetResolve(
          packageUrl,
          target,
          subpath,
          patternMatch,
          isImports,
          conditions,
          mainFields,
          parent,
          fs
        )
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).to.have.property('code', codes.ERR_INVALID_PACKAGE_TARGET)
    })
  })
})
