/**
 * @file Unit Tests - isDirectory
 * @module mlly/lib/tests/unit/isDirectory
 */

import emptyArray from '#fixtures/empty-array'
import fsa from '#fixtures/fsa'
import testSubject from '#lib/is-directory'
import fsCaseType, { type FileSystemCaseType } from '#tests/utils/fs-case-type'
import { faker } from '@faker-js/faker'
import type { FileSystem } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

describe('unit:lib/isDirectory', () => {
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
      [emptyArray],
      [faker.git.commitSha()],
      [new URL(import.meta.url)],
      [pathe.pathToFileURL('src/index.mts')],
      [pathe.pathToFileURL('src/utils').href],
      [pathe.resolve('src/lib/__mocks__')]
    ])('should return `false` if `id` is not directory (%#)', async id => {
      // Act
      const result = testSubject(id, fs)

      // Expect
      expect(isAsync ? await result : result).to.be.false
    })

    it.each<Case>([
      [new URL(pathe.dot, import.meta.url)],
      [pathe.pathToFileURL('src/lib').href],
      [pathe.resolve('src/internal/__tests__')]
    ])('should return `true` if `id` is directory (%#)', async id => {
      // Act
      const result = testSubject(id, fs)

      // Expect
      expect(isAsync ? await result : result).to.be.true
    })
  })
})
