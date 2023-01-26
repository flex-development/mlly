/**
 * @file Type Tests - ResolveModuleOptions
 * @module mlly/interfaces/tests/unit-d/ResolveModuleOptions
 */

import type { ChangeExtFn, ModuleId } from '#src/types'
import type { KeysRequired, Nilable } from '@flex-development/tutils'
import type TestSubject from '../options-resolve-module'

describe('unit-d:interfaces/ResolveModuleOptions', () => {
  it('should allow empty object', () => {
    expectTypeOf<KeysRequired<TestSubject>>().toBeNever()
  })

  it('should match [condition?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('condition')
      .toEqualTypeOf<string | undefined>()
  })

  it('should match [conditions?: Set<string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('conditions')
      .toEqualTypeOf<Set<string> | undefined>()
  })

  it('should match [ext?: ChangeExtFn | Nilable<string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ext')
      .toEqualTypeOf<ChangeExtFn | Nilable<string>>()
  })

  it('should match [extensions?: Set<string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('extensions')
      .toEqualTypeOf<Set<string> | undefined>()
  })

  it('should match [parent?: ModuleId]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parent')
      .toEqualTypeOf<ModuleId | undefined>()
  })

  it('should match [preserveSymlinks?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preserveSymlinks')
      .toEqualTypeOf<boolean | undefined>()
  })
})
