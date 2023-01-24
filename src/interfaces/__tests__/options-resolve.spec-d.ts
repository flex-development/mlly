/**
 * @file Type Tests - ResolveOptions
 * @module mlly/interfaces/tests/unit-d/ResolveOptions
 */

import type TestSubject from '../options-resolve'
import type ResolveModuleOptions from '../options-resolve-module'

describe('unit-d:interfaces/ResolveOptions', () => {
  it('should extend ResolveModuleOptions', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<ResolveModuleOptions>()
  })
})
