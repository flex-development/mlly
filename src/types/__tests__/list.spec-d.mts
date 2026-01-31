/**
 * @file Type Tests - List
 * @module mlly/types/tests/unit-d/List
 */

import type TestSubject from '#types/list'
import type { Condition } from '@flex-development/mlly'

describe('unit-d:types/List', () => {
  type Subject = TestSubject<Condition>

  it('should allow Set<T>', () => {
    expectTypeOf<Set<Condition>>().toExtend<Subject>()
  })

  it('should allow T[]', () => {
    expectTypeOf<Condition[]>().toExtend<Subject>()
  })

  it('should extract ReadonlySet<T>', () => {
    expectTypeOf<Subject>().extract<ReadonlySet<Condition>>().not.toBeNever()
  })

  it('should extract readonly T[]', () => {
    expectTypeOf<Subject>().extract<readonly Condition[]>().not.toBeNever()
  })
})
