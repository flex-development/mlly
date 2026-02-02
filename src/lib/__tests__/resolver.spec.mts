/**
 * @file Unit Tests - resolve
 * @module mlly/lib/tests/unit/resolve
 */

import browserConditions from '#fixtures/browser-conditions'
import fixtureConditions from '#fixtures/conditions'
import emptyArray from '#fixtures/empty-array'
import emptySet from '#fixtures/empty-set'
import fsa from '#fixtures/fsa'
import parent from '#fixtures/parent'
import importMetaResolve from '#fixtures/specifiers/import-meta-resolve'
import moduleSpecifier from '#fixtures/specifiers/module'
import nodeUrlSpecifier from '#fixtures/specifiers/node-url'
import subpathImportEPM from '#fixtures/specifiers/subpath-import-epm'
import chars from '#internal/chars'
import cwd from '#lib/cwd'
import defaultConditions from '#lib/default-conditions'
import defaultMainFields from '#lib/default-main-fields'
import * as testSubject from '#lib/resolver'
import badSubpathImports from '#node_modules/bad-subpath-imports/package.json'
import css from '#node_modules/css/package.json'
import exportsSugarA from '#node_modules/exports-sugar-a/package.json'
import exportsSugar from '#node_modules/exports-sugar/package.json'
import invalidExports1 from '#node_modules/invalid-exports-1/package.json'
import invalidExports2 from '#node_modules/invalid-exports-2/package.json'
import legacyMain1 from '#node_modules/legacy-main-1/package.json'
import legacyMain2 from '#node_modules/legacy-main-2/package.json'
import legacyMain3 from '#node_modules/legacy-main-3/package.json'
import manifestOnly from '#node_modules/manifest-only/package.json'
import subpathExports from '#node_modules/subpath-exports/package.json'
import subpathImports1 from '#node_modules/subpath-imports-1/package.json'
import subpathImports2 from '#node_modules/subpath-imports-2/package.json'
import fsCaseType, { type FileSystemCaseType } from '#tests/utils/fs-case-type'
import toScopeUrl from '#tests/utils/to-scope-url'
import toScopedUrl from '#tests/utils/to-scoped-package-url'
import { isNodeError, type NodeError } from '@flex-development/errnode'
import pkgKronk from '@flex-development/kronk/package.json'
import type { Awaitable, FileSystem } from '@flex-development/mlly'
import pkg from '@flex-development/mlly/package.json'
import pathe from '@flex-development/pathe'
import pkgPathe from '@flex-development/pathe/package.json'
import { cast } from '@flex-development/tutils'
import * as baseline from 'import-meta-resolve'

describe('unit:lib/resolver', () => {
  describe.each<[fst: FileSystemCaseType, fs?: FileSystem | null | undefined]>([
    [fsCaseType.default],
    [fsCaseType.onlyAsync, fsa]
  ])('fs (%s)', (fsType, fs) => {
    let isAsync: boolean

    beforeAll(() => {
      isAsync = fs === fsa
    })

    describe('legacyMainResolve', () => {
      it.each<Parameters<typeof testSubject['legacyMainResolve']>>([
        [toScopeUrl(legacyMain1.name), null, null, parent],
        [toScopeUrl(pkg.name), cast(pkg), new Set(['unpkg']), parent],
        [toScopeUrl(pkg.name), cast(pkg), null, parent]
      ])('should throw if main entry point is not found (%#)', async (
        packageUrl,
        manifest,
        mainFields,
        parent
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL>

        // Act
        try {
          result = testSubject.legacyMainResolve(
            packageUrl,
            manifest,
            mainFields,
            parent,
            fs
          )

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })
    })

    describe('moduleResolve', () => {
      type Case = Parameters<typeof testSubject['moduleResolve']>

      it.each<Case>([
        [
          '../resolver.mts',
          import.meta.url
        ],
        [
          css.name + '/index.css?inline',
          parent,
          null,
          null,
          true
        ],
        [
          exportsSugar.name,
          parent
        ],
        [
          exportsSugarA.name,
          parent
        ],
        [
          importMetaResolve,
          import.meta.url
        ],
        [
          legacyMain1.name + '/a.js',
          parent
        ],
        [
          legacyMain1.name,
          parent
        ],
        [
          legacyMain2.name,
          parent
        ],
        [
          legacyMain3.name,
          parent
        ],
        [
          manifestOnly.name + '/package.json',
          parent
        ],
        [
          moduleSpecifier,
          import.meta.url
        ],
        [
          nodeUrlSpecifier,
          import.meta.url
        ],
        [
          pkg.name,
          import.meta.url,
          fixtureConditions
        ],
        [
          pkg.name + '/read-package-json',
          pathe.pathToFileURL('scratch.mts'),
          fixtureConditions
        ],
        [
          pkgKronk.name + '/parsers',
          pathe.pathToFileURL(`node_modules/${pkgKronk.name}/dist/index.mjs`)
        ],
        [
          pkgPathe.name,
          import.meta.url
        ],
        [
          subpathExports.name + '/lib/a',
          parent
        ],
        [
          subpathExports.name + '/lib/b.js',
          parent
        ],
        [
          subpathExports.name,
          parent
        ],
        [
          subpathImportEPM,
          import.meta.url
        ],
        [
          subpathImports1.specifiers.a,
          toScopedUrl(subpathImports1.name, 'a.mjs')
        ],
        [
          subpathImports1.specifiers.path_posix,
          toScopedUrl(subpathImports1.name, 'path/posix.mjs')
        ],
        [
          subpathImports1.specifiers.path_windows,
          toScopedUrl(subpathImports1.name, 'path/windows.browser.mjs'),
          browserConditions
        ],
        [
          subpathImports2.specifiers.path,
          toScopedUrl(subpathImports2.name, 'parent.mjs'),
          browserConditions
        ]
      ])('should return resolved URL (%j)', async (
        specifier,
        parent,
        conditions,
        mainFields,
        preserveSymlinks
      ) => {
        // Arrange
        let expected: URL | null = null
        let result: Awaitable<URL>

        // `import-meta-resolve` does not support empty pattern matches.
        if (specifier !== subpathImportEPM) {
          expected = baseline.moduleResolve(
            specifier,
            new URL(parent),
            new Set(conditions ?? defaultConditions),
            preserveSymlinks ?? undefined
          )
        }

        // Act
        result = testSubject.moduleResolve(
          specifier,
          parent,
          conditions,
          mainFields,
          preserveSymlinks,
          fs
        )

        if (isAsync) result = await result

        // Expect
        expect(result).to.eql(expected ?? result)
        expect(result).toMatchSnapshot()
      })

      it.each<Case>([
        ['../../internal%2fidentity.mts', import.meta.url]
      ])('should throw if `specifier` contains encoded separators (%#)', async (
        specifier,
        parent,
        conditions,
        mainFields,
        preserveSymlinks
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL>

        // Act
        try {
          result = testSubject.moduleResolve(
            specifier,
            parent,
            conditions,
            mainFields,
            preserveSymlinks,
            fs
          )

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })

      it.each<Case>([
        ['../../internal', import.meta.url],
        [pathe.pathToFileURL('src').href, import.meta.url],
        [pathe.resolve('src/lib'), import.meta.url]
      ])('should throw if `specifier` resolves to a directory (%#)', async (
        specifier,
        parent,
        conditions,
        mainFields,
        preserveSymlinks
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL>

        // Act
        try {
          result = testSubject.moduleResolve(
            specifier,
            parent,
            conditions,
            mainFields,
            preserveSymlinks,
            fs
          )

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })

      it.each<Case>([
        [
          './__mocks__',
          import.meta.url
        ],
        [
          subpathImports1.specifiers.b,
          toScopedUrl(subpathImports1.name, 'index.mjs')
        ],
        [
          badSubpathImports.specifiers.path,
          toScopedUrl(badSubpathImports.name, 'parent.mjs'),
          browserConditions
        ],
        [
          pkg.name,
          import.meta.url
        ],
        [
          pkg.name + '/internal/chain-or-call',
          pathe.pathToFileURL('scratch.mts'),
          fixtureConditions
        ],
        [
          pkg.name.slice(pkg.name.indexOf(pathe.sep) + 1),
          import.meta.url
        ]
      ])('should throw if `specifier` resolves to unknown module (%#)', async (
        specifier,
        parent,
        conditions,
        mainFields,
        preserveSymlinks
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL>

        // Act
        try {
          result = testSubject.moduleResolve(
            specifier,
            parent,
            conditions,
            mainFields,
            preserveSymlinks,
            fs
          )

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })

      it.each<Case>([
        [
          './l.mjs',
          'data:text/javascript,export default import.meta.resolve("./l.mjs")'
        ],
        [
          '/e.mjs',
          'data:text/javascript,export default import.meta.resolve("/e.mjs")'
        ],
        [
          'x',
          'data:text/javascript,export default import.meta.resolve("x")'
        ]
      ])('should throw if module referrer is invalid (%#)', async (
        specifier,
        parent,
        conditions,
        mainFields,
        preserveSymlinks
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL>

        // Act
        try {
          result = testSubject.moduleResolve(
            specifier,
            parent,
            conditions,
            mainFields,
            preserveSymlinks,
            fs
          )

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })
    })

    describe('packageExportsResolve', () => {
      type Case = Parameters<typeof testSubject['packageExportsResolve']>

      it.each<Case>([
        [
          toScopeUrl('invalid-exports-1'),
          pathe.dot,
          invalidExports1.exports,
          null,
          parent
        ],
        [
          toScopeUrl('invalid-exports-2'),
          './lib/a',
          invalidExports2.exports['./lib/*'],
          new Set(['ts-node']),
          parent
        ]
      ])('should throw if `exports` is invalid (%#)', async (
        packageUrl,
        subpath,
        exports,
        conditions,
        parent
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL>

        // Act
        try {
          result = testSubject.packageExportsResolve(
            packageUrl,
            subpath,
            exports,
            conditions,
            parent,
            fs
          )

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })

      it.each<Case>([
        [
          cwd(),
          './internal/chain-or-call',
          pkgKronk.exports,
          null,
          import.meta.url
        ],
        [
          toScopeUrl('exports-array'),
          './array.mjs',
          emptyArray,
          null,
          parent
        ],
        [
          toScopeUrl('manifest-only'),
          pathe.dot,
          manifestOnly.exports,
          emptySet,
          parent
        ],
        [
          toScopeUrl('missing-exports'),
          './lib/a.mjs',
          undefined,
          null,
          parent
        ]
      ])('should throw if package path is not exported (%#)', async (
        packageUrl,
        subpath,
        exports,
        conditions,
        parent
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL>

        // Act
        try {
          result = testSubject.packageExportsResolve(
            packageUrl,
            subpath,
            exports,
            conditions,
            parent,
            fs
          )

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })
    })

    describe('packageImportsExportsResolve', () => {
      it.each<Parameters<typeof testSubject['packageImportsExportsResolve']>>([
        [
          '#internal/fs',
          pkg.imports,
          cwd(),
          true,
          fixtureConditions,
          defaultMainFields,
          import.meta.url
        ],
        [
          './package.json',
          pkg.exports,
          cwd(),
          false,
          defaultConditions,
          defaultMainFields,
          import.meta.url
        ]
      ])('should return resolved package export or import URL (%j)', async (
        matchKey,
        matchObject,
        packageUrl,
        isImports,
        conditions,
        mainFields,
        parent
      ) => {
        // Arrange
        let result: Awaitable<URL>

        // Act
        result = testSubject.packageImportsExportsResolve(
          matchKey,
          matchObject,
          packageUrl,
          isImports,
          conditions,
          mainFields,
          parent,
          fs
        )

        if (isAsync) result = await result

        // Expect
        expect(result).to.be.instanceof(URL)
        expect(result).toMatchSnapshot()
      })
    })

    describe('packageImportsResolve', () => {
      type Case = Parameters<typeof testSubject['packageImportsResolve']>

      it.each<Case>([
        [chars.hash, import.meta.url],
        [chars.hash + pathe.sep, import.meta.url],
        [pkg.name, import.meta.url, fixtureConditions]
      ])('should throw if `specifier` is invalid (%#)', async (
        specifier,
        parent,
        conditions,
        mainFields
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL>

        // Act
        try {
          result = testSubject.packageImportsResolve(
            specifier,
            parent,
            conditions,
            mainFields,
            fs
          )

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })

      it.each<Case>([
        ['#internal/a', toScopedUrl('subpath-exports', 'a.mjs')],
        ['#internal/identity', cwd()]
      ])('should throw if package import is not defined (%#)', async (
        specifier,
        parent,
        conditions,
        mainFields
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL>

        // Act
        try {
          result = testSubject.packageImportsResolve(
            specifier,
            parent,
            conditions,
            mainFields,
            fs
          )

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })
    })

    describe('packageResolve', () => {
      type Case = Parameters<typeof testSubject['packageResolve']>

      it.each<Case>([
        ['missing-package', parent]
      ])('should throw if `specifier` cannot be resolved (%#)', async (
        specifier,
        parent,
        conditions,
        mainFields
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL>

        // Act
        try {
          result = testSubject.packageResolve(
            specifier,
            parent,
            conditions,
            mainFields,
            fs
          )

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })

      it.each<Case>([
        [pkgPathe.name.replace(pathe.sep, '\\'), import.meta.url],
        [chars.at, import.meta.url],
        [chars.empty, import.meta.url]
      ])('should throw if `specifier` is invalid (%#)', async (
        specifier,
        parent,
        conditions,
        mainFields
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL>

        // Act
        try {
          result = testSubject.packageResolve(
            specifier,
            parent,
            conditions,
            mainFields,
            fs
          )

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })
    })

    describe('packageSelfResolve', () => {
      it.each<Parameters<typeof testSubject['packageSelfResolve']>>([
        [
          pkg.name,
          pathe.dot,
          pathe.pathToFileURL('../parent.mjs'),
          fixtureConditions
        ]
      ])('should return `undefined` if package scope is not found (%#)', async (
        name,
        subpath,
        parent,
        conditions
      ) => {
        // Arrange
        let result: Awaitable<URL | undefined>

        // Act
        result = testSubject.packageSelfResolve(
          name,
          subpath,
          parent,
          conditions,
          fs
        )

        if (isAsync) result = await result

        // Expect
        expect(result).to.be.undefined
      })
    })

    describe('packageTargetResolve', () => {
      type Case = Parameters<typeof testSubject['packageTargetResolve']>

      it.each<Case>([
        [
          toScopeUrl('invalid-pattern-match'),
          './__fixtures__/*',
          '#fixtures/*',
          'node_modules/legacy-main-1/package.json',
          true,
          null,
          null,
          toScopedUrl('invalid-pattern-match', 'parent.mjs')
        ]
      ])('should throw if `patternMatch` has invalid segments (%#)', async (
        packageUrl,
        target,
        subpath,
        patternMatch,
        isImports,
        conditions,
        mainFields,
        parent
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL | null | undefined>

        // Act
        try {
          result = testSubject.packageTargetResolve(
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

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })

      it.each<Case>([
        [
          toScopeUrl('invalid-target-segment'),
          [null, './__fixtures__/node_modules/*'],
          '#node_modules/*',
          'legacy-main-2/package.json',
          true,
          null,
          null,
          toScopedUrl('invalid-target-segment', 'parent.mjs')
        ]
      ])('should throw if `target` has invalid segments (%#)', async (
        packageUrl,
        target,
        subpath,
        patternMatch,
        isImports,
        conditions,
        mainFields,
        parent
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL | null | undefined>

        // Act
        try {
          result = testSubject.packageTargetResolve(
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

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })

      it.each<Case>([
        [
          toScopeUrl('invalid-target-numeric-keys'),
          [{ 13: null }],
          pathe.dot,
          null,
          false,
          null,
          null,
          import.meta.url
        ]
      ])('should throw if `target` has numeric property keys (%#)', async (
        packageUrl,
        target,
        subpath,
        patternMatch,
        isImports,
        conditions,
        mainFields,
        parent
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL | null | undefined>

        // Act
        try {
          result = testSubject.packageTargetResolve(
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

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })

      it.each<Case>([
        [
          String(toScopeUrl('target-resolved-outside')) + '../',
          './index.mjs',
          pathe.dot,
          null,
          false,
          null,
          null,
          import.meta.url
        ]
      ])('should throw if `target` resolves outside package scope (%#)', async (
        packageUrl,
        target,
        subpath,
        patternMatch,
        isImports,
        conditions,
        mainFields,
        parent
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL | null | undefined>

        // Act
        try {
          result = testSubject.packageTargetResolve(
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

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })

      it.each<Case>([
        [
          toScopeUrl('invalid-target-main'),
          [undefined, [13], [{}], {}],
          pathe.dot,
          null,
          false,
          null,
          null,
          import.meta.url
        ],
        [
          toScopeUrl('target-outside'),
          {
            browser: '../fs.browser.mjs',
            node: 'fs', // eslint-disable-next-line sort-keys
            default: 'fs'
          },
          '#internal/fs',
          null,
          true,
          browserConditions,
          null,
          toScopedUrl('target-outside', 'outside.mjs')
        ],
        [
          toScopeUrl('target-url'),
          {
            default: {
              browser: [null, 'https://esm.sh/@flex-development/pathe'],
              node: 'path', // eslint-disable-next-line sort-keys
              default: 'path'
            }
          },
          '#internal/path',
          null,
          true,
          browserConditions,
          null,
          toScopedUrl('target-url', 'url.mjs')
        ]
      ])('should throw if package target is invalid (%#)', async (
        packageUrl,
        target,
        subpath,
        patternMatch,
        isImports,
        conditions,
        mainFields,
        parent
      ) => {
        // Arrange
        let error!: NodeError
        let result!: Awaitable<URL | null | undefined>

        // Act
        try {
          result = testSubject.packageTargetResolve(
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

          if (isAsync) result = await result
        } catch (e: unknown) {
          error = (void result, e as typeof error)
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).toMatchSnapshot()
      })
    })
  })
})
