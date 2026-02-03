/**
 * @file Type Tests - ReadFile
 * @module mlly/interfaces/tests/unit-d/ReadFile
 */

import type TestSubject from '#interfaces/read-file'
import type {
  Awaitable,
  BufferEncoding,
  FileContent,
  ModuleId
} from '@flex-development/mlly'
import type * as fs from 'node:fs'

describe('unit-d:interfaces/ReadFile', () => {
  it('should allow fs.promises.readFile', () => {
    expectTypeOf<typeof fs['promises']['readFile']>().toExtend<TestSubject>()
  })

  it('should allow fs.readFileSync', () => {
    expectTypeOf<typeof fs['readFileSync']>().toExtend<TestSubject>()
  })

  it('should match [this: unknown]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<unknown>()
  })

  describe('parameters', () => {
    it('should be callable with [ModuleId, (BufferEncoding | null | undefined)?]', () => {
      expectTypeOf<TestSubject>().parameters.toEqualTypeOf<
        | [ModuleId, (BufferEncoding | null | undefined)?]
        | [ModuleId, BufferEncoding]
      >()
    })
  })

  describe('returns', () => {
    it('should return Awaitable<FileContent | null | undefined>', () => {
      expectTypeOf<TestSubject>()
        .returns
        .toExtend<Awaitable<FileContent | null | undefined>>()
    })
  })
})
