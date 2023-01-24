/**
 * @file Type Tests - FillModuleOptions
 * @module mlly/interfaces/tests/unit-d/FillModuleOptions
 */

import type { ChangeExtFn } from '#src/types'
import type TestSubject from '../options-fill-module'
import type ResolveModuleOptions from '../options-resolve-module'

describe('unit-d:interfaces/FillModuleOptions', () => {
  it('should extend ResolveModuleOptions', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<ResolveModuleOptions>()
  })

  it('should match [ext: ChangeExtFn<string> | string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ext')
      .toEqualTypeOf<ChangeExtFn<string> | string>()
  })
})
