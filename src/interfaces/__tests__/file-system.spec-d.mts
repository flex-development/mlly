/**
 * @file Type Tests - FileSystem
 * @module mlly/interfaces/tests/unit-d/FileSystem
 */

import type TestSubject from '#interfaces/file-system'
import type { Awaitable, ModuleId, Stats } from '@flex-development/mlly'

describe('unit-d:interfaces/FileSystem', () => {
  describe('readFile', () => {
    type Subject = TestSubject['readFile']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with [ModuleId]', () => {
        expectTypeOf<Subject>().parameters.toEqualTypeOf<[ModuleId]>()
      })
    })

    describe('returns', () => {
      it('should return Awaitable<Buffer | string>', () => {
        expectTypeOf<Subject>()
          .returns
          .toEqualTypeOf<Awaitable<Buffer | string>>()
      })
    })
  })

  describe('realpath', () => {
    type Subject = TestSubject['realpath']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with [ModuleId]', () => {
        expectTypeOf<Subject>().parameters.toEqualTypeOf<[ModuleId]>()
      })
    })

    describe('returns', () => {
      it('should return Awaitable<string>', () => {
        expectTypeOf<Subject>().returns.toEqualTypeOf<Awaitable<string>>()
      })
    })
  })

  describe('stat', () => {
    type Subject = TestSubject['stat']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with [ModuleId]', () => {
        expectTypeOf<Subject>().parameters.toEqualTypeOf<[ModuleId]>()
      })
    })

    describe('returns', () => {
      it('should return Awaitable<Stats>', () => {
        expectTypeOf<Subject>().returns.toEqualTypeOf<Awaitable<Stats>>()
      })
    })
  })
})
