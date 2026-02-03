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
  type T = Promise<FileContent | null | undefined>
  type Subject = TestSubject<T>

  it('should allow fs.promises.readFile', () => {
    expectTypeOf<typeof fs['promises']['readFile']>().toExtend<TestSubject>()
  })

  it('should allow fs.readFileSync', () => {
    expectTypeOf<typeof fs['readFileSync']>().toExtend<TestSubject>()
  })

  it('should match [this: void]', () => {
    expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [ModuleId, (BufferEncoding | null | undefined)?]', () => {
      expectTypeOf<Subject>().parameters.toEqualTypeOf<
        | [ModuleId, (BufferEncoding | null | undefined)?]
        | [ModuleId, BufferEncoding]
      >()
    })
  })

  describe('returns', () => {
    it('should return Awaitable<string> | T', () => {
      expectTypeOf<Subject>().returns.toEqualTypeOf<Awaitable<string> | T>()
    })
  })
})
