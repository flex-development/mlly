/**
 * @file Unit Tests - isFile
 * @module mlly/lib/tests/unit/isFile
 */

import emptySet from '#fixtures/empty-set'
import fsa from '#fixtures/fsa'
import testSubject from '#lib/is-file'
import fsCaseType, { type FileSystemCaseType } from '#tests/utils/fs-case-type'
import { faker } from '@faker-js/faker'
import type { FileSystem } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

describe('unit:lib/isFile', () => {
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
      [emptySet],
      [faker.git.commitSha()],
      [new URL(pathe.dot, import.meta.url)],
      [pathe.pathToFileURL('src/internal').href],
      [pathe.resolve('source')]
    ])('should return `false` if `id` is not file (%#)', async id => {
      // Act
      const result = testSubject(id, fs)

      // Expect
      expect(isAsync ? await result : result).to.be.false
    })

    it.each<Case>([
      [new URL(import.meta.url)],
      [pathe.pathToFileURL('src/index.mts').href],
      [pathe.resolve('package.json')]
    ])('should return `true` if `id` is file (%#)', async id => {
      // Act
      const result = testSubject(id, fs)

      // Expect
      expect(isAsync ? await result : result).to.be.true
    })
  })
})
