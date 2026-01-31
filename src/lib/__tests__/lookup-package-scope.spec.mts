/**
 * @file Unit Tests - lookupPackageScope
 * @module mlly/lib/tests/unit/lookupPackageScope
 */

import fsa from '#fixtures/fsa'
import chars from '#internal/chars'
import cwd from '#lib/cwd'
import testSubject from '#lib/lookup-package-scope'
import fsCaseType, { type FileSystemCaseType } from '#tests/utils/fs-case-type'
import type { Awaitable, FileSystem } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

describe('unit:lib/lookupPackageScope', () => {
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
      [chars.empty],
      [cwd()],
      [null],
      [pathe.resolve('package.json')],
      [pathe.pathToFileURL('node_modules/@flex-development/null.mjs')],
      [
        pathe.pathToFileURL('__fixtures__/parent.mts'),
        pathe.pathToFileURL('__fixtures__/')
      ]
    ])('should return `null` if package directory is not found (%#)', async (
      url,
      end
    ) => {
      // Act
      const result = testSubject(url, end, fs)

      // Expect
      expect(isAsync ? await result : result).to.be.null
    })

    it.each<Case>([
      [import.meta.url],
      [pathe.pathToFileURL('package.json')],
      [pathe.pathToFileURL('node_modules/@commitlint/cli/index.cjs')],
      [pathe.pathToFileURL(
        'node_modules/@flex-development/remark-preset/node_modules/micromark/lib/initialize/document.js'
      )],
      [pathe.pathToFileURL('node_modules/vitest/vitest.mjs')]
    ])('should return URL of package directory (%#)', async (url, end) => {
      // Arrange
      let result: Awaitable<URL | null>

      // Act
      result = testSubject(url, end, fs)
      if (isAsync) result = await result

      // Expect
      expect(result).to.not.be.null
      expect(result).to.have.property('href').endWith(pathe.sep)
      expect(result).to.have.property('pathname').endWith(pathe.sep)
      expect(String(url)).to.startWith((result as URL).href)
      expect(String(result)).toMatchSnapshot()
    })
  })
})
