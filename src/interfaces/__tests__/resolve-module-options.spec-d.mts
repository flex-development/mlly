/**
 * @file Type Tests - ResolveModuleOptions
 * @module mlly/interfaces/tests/unit-d/ResolveModuleOptions
 */

import type TestSubject from '#interfaces/resolve-module-options'
import type {
  ChangeExtFn,
  Condition,
  FileSystem,
  List,
  MainField
} from '@flex-development/mlly'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/ResolveModuleOptions', () => {
  it('should allow empty object', () => {
    assertType<TestSubject>({})
  })

  it('should match [conditions?: List<Condition> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('conditions')
      .toEqualTypeOf<Nilable<List<Condition>>>()
  })

  it('should match [ext?: ChangeExtFn | string | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ext')
      .toEqualTypeOf<Nilable<ChangeExtFn | string>>()
  })

  it('should match [extensions?: List<string> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('extensions')
      .toEqualTypeOf<Nilable<List<string>>>()
  })

  it('should match [fs?: FileSystem | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('fs')
      .toEqualTypeOf<Nilable<FileSystem>>()
  })

  it('should match [mainFields?: List<MainField> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mainFields')
      .toEqualTypeOf<Nilable<List<MainField>>>()
  })

  it('should match [preserveSymlinks?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preserveSymlinks')
      .toEqualTypeOf<Nilable<boolean>>()
  })
})
