/**
 * @file Type Tests - ParseModuleIdOptions
 * @module mlly/interfaces/tests/unit-d/ParseModuleIdOptions
 */

import type { ModuleId } from '#src/types'
import type { Optional, RequiredKeys } from '@flex-development/tutils'
import type TestSubject from '../options-parse-module-id'

describe('unit-d:interfaces/ParseModuleIdOptions', () => {
  it('should allow empty object', () => {
    expectTypeOf<RequiredKeys<TestSubject>>().toBeNever()
  })

  it('should match [internal?: Optional<boolean>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('internal')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [parent?: Optional<ModuleId>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parent')
      .toEqualTypeOf<Optional<ModuleId>>()
  })

  it('should match [pkgname?: Optional<boolean>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('pkgname')
      .toEqualTypeOf<Optional<boolean>>()
  })
})
