/**
 * @file Type Tests - Stats
 * @module mlly/interfaces/tests/unit-d/Stats
 */

import type TestSubject from '#interfaces/stats'
import type { EmptyArray } from '@flex-development/tutils'

describe('unit-d:interfaces/Stats', () => {
  describe('isDirectory', () => {
    type Subject = TestSubject['isDirectory']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with []', () => {
        expectTypeOf<Subject>().parameters.toEqualTypeOf<EmptyArray>()
      })
    })

    describe('returns', () => {
      it('should return boolean', () => {
        expectTypeOf<Subject>().returns.toEqualTypeOf<boolean>()
      })
    })
  })

  describe('isFile', () => {
    type Subject = TestSubject['isFile']

    it('should match [this: void]', () => {
      expectTypeOf<Subject>().thisParameter.toEqualTypeOf<void>()
    })

    describe('parameters', () => {
      it('should be callable with []', () => {
        expectTypeOf<Subject>().parameters.toEqualTypeOf<EmptyArray>()
      })
    })

    describe('returns', () => {
      it('should return boolean', () => {
        expectTypeOf<Subject>().returns.toEqualTypeOf<boolean>()
      })
    })
  })
})
