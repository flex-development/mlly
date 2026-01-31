/**
 * @file Unit Tests - getSource
 * @module mlly/lib/tests/unit/getSource
 */

import fsa from '#fixtures/fsa'
import isPromise from '#internal/is-promise'
import testSubject from '#lib/get-source'
import fsCaseType, { type FileSystemCaseType } from '#tests/utils/fs-case-type'
import {
  codes,
  isNodeError,
  type NodeError
} from '@flex-development/errnode'
import type { FileSystem } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'

describe('unit:lib/getSource', () => {
  describe.each<[fst: FileSystemCaseType, fs?: FileSystem | null | undefined]>([
    [fsCaseType.default],
    [fsCaseType.onlyAsync, fsa]
  ])('fs (%s)', (fsType, fs) => {
    type Case = Parameters<typeof testSubject>

    let isAsync: boolean

    beforeAll(() => {
      isAsync = fs === fsa
    })

    it('should return `null` if no module `id`', () => {
      expect(testSubject(null, { fs })).to.be.null
    })

    describe('ERR_UNSUPPORTED_ESM_URL_SCHEME', () => {
      let git: string
      let schemes: string[]

      beforeAll(() => {
        git = 'git://github.com/flex-development/mlly.git'
        schemes = ['data']
      })

      it('should not throw if error is ignored', () => {
        // Act
        const result = testSubject(git, { fs, ignoreErrors: true, schemes })

        // Expect
        expect(result).to.be.undefined
      })

      it('should throw if error is not ignored', () => {
        // Arrange
        const code: NodeError['code'] = codes.ERR_UNSUPPORTED_ESM_URL_SCHEME
        let error!: NodeError

        // Act
        try {
          testSubject(git, { fs, schemes })
        } catch (e: unknown) {
          error = e as typeof error
        }

        // Expect
        expect(error).to.satisfy(isNodeError)
        expect(error).to.have.property('code', code)
      })
    })

    describe('data:', () => {
      it.each<Case>([
        ['data:application/javascript;base64,SGVsbG8sIFdvcmxkIQ=='],
        [new URL('data:text/javascript,console.log("hello!");')]
      ])('should return source code for `id` (%#)', (id, options) => {
        // Act
        const result = testSubject(id, { ...options, fs })

        // Expect
        expect(result).to.not.satisfy(isPromise)
        expect(result).toMatchSnapshot()
      })
    })

    describe('file:', () => {
      it.each<Case>([
        [pathe.pathToFileURL('src/internal/index.mts')]
      ])('should return `null` if no file at `id` (%#)', async (
        id,
        options
      ) => {
        // Act
        const result = testSubject(id, { ...options, fs })

        // Expect
        expect(isAsync ? await result : result).to.be.null
      })

      it.each<Case>([
        [pathe.pathToFileURL('grease.config.json')],
        [pathe.pathToFileURL('vite.config.mts').href]
      ])('should return source code for `id` (%#)', async (id, options) => {
        // Act
        const result = testSubject(id, { ...options, fs })

        // Expect
        expect(isAsync ? await result : result).toMatchSnapshot()
      })
    })

    describe('http[s]:', () => {
      it.each<Case>([
        [new URL('https://esm.sh/@flex-development/mlly')]
      ])('should return source code for `id` (%#)', async (id, options) => {
        // Act
        const result = testSubject(id, { ...options, fs })

        // Expect
        expect(result).to.satisfy(isPromise)
        expect(await result).toMatchSnapshot()
      })
    })

    describe('node:', () => {
      it.each<Case>([
        ['os'],
        [new URL('node:test')]
      ])('should return `undefined` if `id` is builtin module (%#)', id => {
        expect(testSubject(id, { fs })).to.be.undefined
      })
    })
  })
})
