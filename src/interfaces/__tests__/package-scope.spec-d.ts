/**
 * @file Type Tests - PackageScope
 * @module mlly/interfaces/tests/unit-d/PackageScope
 */

import type { PackageJson } from '@flex-development/pkg-types'
import type TestSubject from '../package-scope'

describe('unit-d:interfaces/PackageScope', () => {
  it('should match [dir: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('dir').toBeString()
  })

  it('should match [pkg: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('pkg').toBeString()
  })

  it('should match [pkgjson: PackageJson]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('pkgjson')
      .toEqualTypeOf<PackageJson>()
  })
})
