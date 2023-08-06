/**
 * @file Type Tests - ResolveModuleOptions
 * @module mlly/interfaces/tests/unit-d/ResolveModuleOptions
 */

import type { ChangeExtFn, ModuleId } from '#src/types'
import type { Nilable, Optional, RequiredKeys } from '@flex-development/tutils'
import type TestSubject from '../options-resolve-module'

describe('unit-d:interfaces/ResolveModuleOptions', () => {
  it('should allow empty object', () => {
    expectTypeOf<RequiredKeys<TestSubject>>().toBeNever()
  })

  it('should match [condition?: Optional<string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('condition')
      .toEqualTypeOf<Optional<string>>()
  })

  it('should match [conditions?: Optional<Set<string> | string[]>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('conditions')
      .toEqualTypeOf<Optional<Set<string> | string[]>>()
  })

  it('should match [ext?: ChangeExtFn | Nilable<string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ext')
      .toEqualTypeOf<ChangeExtFn | Nilable<string>>()
  })

  it('should match [extensions?: Optional<Set<string> | string[]>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('extensions')
      .toEqualTypeOf<Optional<Set<string> | string[]>>()
  })

  it('should match [parent?: ModuleId]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parent')
      .toEqualTypeOf<Optional<ModuleId>>()
  })

  it('should match [preserveSymlinks?: Optional<boolean>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preserveSymlinks')
      .toEqualTypeOf<Optional<boolean>>()
  })
})
