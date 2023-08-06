/**
 * @file Type Tests - ResolveAliasOptions
 * @module mlly/interfaces/tests/unit-d/ResolveAliasOptions
 */

import type { ModuleId } from '#src/types'
import type { MapLike, OneOrMany, Optional } from '@flex-development/tutils'
import type TestSubject from '../options-resolve-alias'
import type ResolveModuleOptions from '../options-resolve-module'

describe('unit-d:interfaces/ResolveAliasOptions', () => {
  it('should extend ResolveModuleOptions', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<ResolveModuleOptions>()
  })

  it('should match [absolute?: Optional<boolean>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('absolute')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [aliases?: Optional<MapLike<OneOrMany<string>>>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('aliases')
      .toEqualTypeOf<Optional<MapLike<OneOrMany<string>>>>()
  })

  it('should match [cwd?: Optional<ModuleId>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('cwd')
      .toEqualTypeOf<Optional<ModuleId>>()
  })
})
