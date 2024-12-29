/**
 * @file Type Tests - FileSystem
 * @module mlly/interfaces/tests/unit-d/FileSystem
 */

import type TestSubject from '#interfaces/file-system'
import type { ModuleId, Stats } from '@flex-development/mlly'

describe('unit-d:interfaces/FileSystem', () => {
  describe('readFileSync', () => {
    type Subject = TestSubject['readFileSync']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with [ModuleId]', () => {
        expectTypeOf<Subject>().parameters.toEqualTypeOf<[ModuleId]>()
      })
    })

    describe('returns', () => {
      it('should return Buffer | string', () => {
        expectTypeOf<Subject>().returns.toEqualTypeOf<Buffer | string>()
      })
    })
  })

  describe('realpathSync', () => {
    type Subject = TestSubject['realpathSync']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with [ModuleId]', () => {
        expectTypeOf<Subject>().parameters.toEqualTypeOf<[ModuleId]>()
      })
    })

    describe('returns', () => {
      it('should return string', () => {
        expectTypeOf<Subject>().returns.toEqualTypeOf<string>()
      })
    })
  })

  describe('statSync', () => {
    type Subject = TestSubject['statSync']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with [ModuleId]', () => {
        expectTypeOf<Subject>().parameters.toEqualTypeOf<[ModuleId]>()
      })
    })

    describe('returns', () => {
      it('should return Stats', () => {
        expectTypeOf<Subject>().returns.toEqualTypeOf<Stats>()
      })
    })
  })
})
