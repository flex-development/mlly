/**
 * @file Unit Tests - resolveModule
 * @module mlly/lib/tests/unit/resolveModule
 */

import browserConditions from '#fixtures/browser-conditions'
import conditions from '#fixtures/conditions'
import fsa from '#fixtures/fsa'
import nodeUrl from '#fixtures/node-url'
import parent from '#fixtures/parent'
import importMetaResolve from '#fixtures/specifiers/import-meta-resolve'
import moduleSpecifier from '#fixtures/specifiers/module'
import testSubject from '#lib/resolve-module'
import badSubpathImports from '#node_modules/bad-subpath-imports/package.json'
import invalidExports1 from '#node_modules/invalid-exports-1/package.json'
import legacyMain1 from '#node_modules/legacy-main-1/package.json'
import legacyMain2 from '#node_modules/legacy-main-2/package.json'
import subpathExports from '#node_modules/subpath-exports/package.json'
import fsCaseType, { type FileSystemCaseType } from '#tests/utils/fs-case-type'
import toScopedUrl from '#tests/utils/to-scoped-package-url'
import { isNodeError, type NodeError } from '@flex-development/errnode'
import pkgKronk from '@flex-development/kronk/package.json'
import type { Awaitable, FileSystem } from '@flex-development/mlly'
import pkg from '@flex-development/mlly/package.json'
import pkgPathe from '@flex-development/pathe/package.json'

describe('unit:lib/resolveModule', () => {
  describe.each<[fst: FileSystemCaseType, fs?: FileSystem | null | undefined]>([
    [fsCaseType.default],
    [fsCaseType.onlyAsync, fsa]
  ])('fs (%s)', (fsType, fs) => {
    type Case = Parameters<typeof testSubject>

    let isAsync: boolean

    beforeAll(() => {
      isAsync = fs === fsa
    })

    it.each<Case>([
      ['#internal/identity', import.meta.url, { conditions, ext: 'mjs' }],
      ['../../lib', import.meta.url, { ext: () => 'mjs' }],
      ['@types/unist', import.meta.url],
      ['data:text/javascript,', import.meta.url],
      ['https://esm.sh/' + pkg.name, import.meta.url],
      ['unist', import.meta.url],
      [importMetaResolve, import.meta.url],
      [legacyMain1.name + '/a.js', parent],
      [legacyMain2.name, parent],
      [moduleSpecifier, import.meta.url],
      [nodeUrl, import.meta.url],
      [pkg.name + '/package.json', import.meta.url],
      [pkgKronk.name, import.meta.url],
      [pkgPathe.name + '/dot', import.meta.url],
      [subpathExports.name + '/lib/a.js', parent, { ext: { '.js': false } }]
    ])('should return resolved URL (%j)', async (
      specifier,
      parent,
      options
    ) => {
      // Act
      let result = testSubject(specifier, parent, { ...options, fs })
      if (isAsync) result = await result

      // Expect
      expect(result).to.be.instanceof(URL)
      expect(result).toMatchSnapshot()
    })

    it.each<Case>([
      [
        badSubpathImports.specifiers.path,
        toScopedUrl(badSubpathImports.name, 'index.mjs'),
        { conditions: browserConditions }
      ],
      [
        pkgKronk.name,
        import.meta.url,
        { conditions: new Set(['kronk']) }
      ],
      [
        invalidExports1.name,
        parent
      ]
    ])('should throw if `specifier` cannot be resolved (%#)', async (
      specifier,
      parent,
      options
    ) => {
      // Arrange
      let error!: NodeError
      let result!: Awaitable<URL>

      // Act
      try {
        result = testSubject(specifier, parent, { ...options, fs })
        if (isAsync) result = await result
      } catch (e: unknown) {
        error = (void result, e as typeof error)
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
    })
  })
})
