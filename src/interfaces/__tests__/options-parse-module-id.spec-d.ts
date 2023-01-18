/**
 * @file Type Tests - ParseModuleIdOptions
 * @module mlly/interfaces/tests/unit-d/ParseModuleIdOptions
 */

import type { ModuleId } from '#src/types'
import type { KeysRequired } from '@flex-development/tutils'
import type TestSubject from '../options-parse-module-id'

describe('unit-d:interfaces/ParseModuleIdOptions', () => {
  it('should allow empty object', () => {
    expectTypeOf<KeysRequired<TestSubject>>().toBeNever()
  })

  it('should match [internal?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('internal')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [parent?: ModuleId]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parent')
      .toEqualTypeOf<ModuleId | undefined>()
  })

  it('should match [pkgname?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('pkgname')
      .toEqualTypeOf<boolean | undefined>()
  })
})
