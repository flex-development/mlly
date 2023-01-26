/**
 * @file Type Tests - ResolveAliasOptions
 * @module mlly/interfaces/tests/unit-d/ResolveAliasOptions
 */

import type { ModuleId } from '#src/types'
import type { MapLike, OneOrMany } from '@flex-development/tutils'
import type TestSubject from '../options-resolve-alias'
import type ResolveModuleOptions from '../options-resolve-module'

describe('unit-d:interfaces/ResolveAliasOptions', () => {
  it('should extend ResolveModuleOptions', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<ResolveModuleOptions>()
  })

  it('should match [absolute?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('absolute')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [aliases?: MapLike<OneOrMany<string>>', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('aliases')
      .toEqualTypeOf<MapLike<OneOrMany<string>> | undefined>()
  })

  it('should match [cwd?: ModuleId]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('cwd')
      .toEqualTypeOf<ModuleId | undefined>()
  })
})
