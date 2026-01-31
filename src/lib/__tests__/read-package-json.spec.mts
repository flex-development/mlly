/**
 * @file Unit Tests - readPackageJson
 * @module mlly/lib/tests/unit/readPackageJson
 */

import fsa from '#fixtures/fsa'
import invalidJsonUrl from '#fixtures/invalid-json-url'
import cwd from '#lib/cwd'
import testSubject from '#lib/read-package-json'
import fsCaseType, { type FileSystemCaseType } from '#tests/utils/fs-case-type'
import toScopeUrl from '#tests/utils/to-scope-url'
import {
  isNodeError,
  type NodeError
} from '@flex-development/errnode'
import type { Awaitable, FileSystem } from '@flex-development/mlly'
import pkg from '@flex-development/mlly/package.json'
import type { PackageJson } from '@flex-development/pkg-types'

describe('unit:lib/readPackageJson', () => {
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
      [null],
      [import.meta.url]
    ])('should return `null` if `package.json` file is not found (%#)', async (
      id,
      specifier,
      parent
    ) => {
      // Arrange
      let result: Awaitable<PackageJson | null>

      // Act
      result = testSubject(id, specifier, parent, fs)

      // Expect
      expect(isAsync ? await result : result).to.be.null
    })

    it('should return package manifest object', async () => {
      // Arrange
      let result: Awaitable<PackageJson | null>

      // Act
      result = testSubject(cwd(), null, null, fs)

      // Expect
      expect(isAsync ? await result : result).to.eql(pkg)
    })

    it.each<Case>([
      [toScopeUrl('invalid-manifest-1'), null, import.meta.url],
      [toScopeUrl('invalid-manifest-2'), 'invalid-manifest-2', import.meta.url]
    ])('should throw if package manifest is not json object (%#)', async (
      id,
      specifier,
      parent
    ) => {
      // Arrange
      let error!: NodeError
      let result!: Awaitable<PackageJson | null>

      // Act
      try {
        result = testSubject(id, specifier, parent, fs)
        if (isAsync) result = await result
      } catch (e: unknown) {
        error = (void result, e as typeof error)
      }

      // Expect
      expect(error).to.satisfy(isNodeError)
      expect(error).toMatchSnapshot()
    })

    it.each<Case>([
      [invalidJsonUrl, 'package.json', import.meta.url],
      [invalidJsonUrl, String(new URL('package.json', invalidJsonUrl))]
    ])('should throw if package manifest is not valid json (%#)', async (
      id,
      specifier,
      parent
    ) => {
      // Arrange
      let error!: NodeError
      let result!: Awaitable<PackageJson | null>

      // Act
      try {
        result = testSubject(id, specifier, parent, fs)
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
