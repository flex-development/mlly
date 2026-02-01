/**
 * @file Type Tests - ResolveAliasOptions
 * @module mlly/interfaces/tests/unit-d/ResolveAliasOptions
 */

import type TestSubject from '#interfaces/resolve-alias-options'
import type {
  Aliases,
  ModuleId,
  ResolveModuleOptions
} from '@flex-development/mlly'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/ResolveAliasOptions', () => {
  it('should allow empty object', () => {
    assertType<TestSubject>({})
  })

  it('should extend ResolveModuleOptions', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<ResolveModuleOptions>()
  })

  it('should match [absolute?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('absolute')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [aliases?: Aliases | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('aliases')
      .toEqualTypeOf<Nilable<Aliases>>()
  })

  it('should match [cwd?: ModuleId | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('cwd')
      .toEqualTypeOf<Nilable<ModuleId>>()
  })

  it('should match [parent?: ModuleId | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parent')
      .toEqualTypeOf<Nilable<ModuleId>>()
  })
})
