/**
 * @file Type Tests - ResolveModuleOptions
 * @module mlly/interfaces/tests/unit-d/ResolveModuleOptions
 */

import type TestSubject from '#interfaces/options-resolve-module'
import type {
  ChangeExtFn,
  FileSystem,
  MainField
} from '@flex-development/mlly'
import type { Condition } from '@flex-development/pkg-types'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/ResolveModuleOptions', () => {
  it('should allow empty object', () => {
    assertType<TestSubject>({})
  })

  it('should match [conditions?: Condition[] | Set<Condition> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('conditions')
      .toEqualTypeOf<Nilable<Condition[] | Set<Condition>>>()
  })

  it('should match [ext?: ChangeExtFn | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ext')
      .toEqualTypeOf<Nilable<ChangeExtFn | string>>()
  })

  it('should match [extensions?: Set<string> | string[] | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('extensions')
      .toEqualTypeOf<Nilable<Set<string> | string[]>>()
  })

  it('should match [fs?: FileSystem | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('fs')
      .toEqualTypeOf<Nilable<FileSystem>>()
  })

  it('should match [mainFields?: MainField[] | Set<MainField> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mainFields')
      .toEqualTypeOf<Nilable<MainField[] | Set<MainField>>>()
  })

  it('should match [preserveSymlinks?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preserveSymlinks')
      .toEqualTypeOf<Nilable<boolean>>()
  })
})
