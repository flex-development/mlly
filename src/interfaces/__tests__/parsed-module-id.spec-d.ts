/**
 * @file Type Tests - ParsedModuleId
 * @module mlly/interfaces/tests/unit-d/ParsedModuleId
 */

import type { Protocol } from '#src/types'
import type { SemanticVersion } from '@flex-development/pkg-types'
import type { EmptyString, LiteralUnion } from '@flex-development/tutils'
import type TestSubject from '../parsed-module-id'

describe('unit-d:interfaces/ParsedModuleId', () => {
  it('should match [internal: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('internal')
      .toEqualTypeOf<boolean>()
  })

  it('should match [path: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('path').toEqualTypeOf<string>()
  })

  it('should match [pkg: LiteralUnion<EmptyString, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('pkg')
      .toEqualTypeOf<LiteralUnion<EmptyString, string>>()
  })

  it('should match [protocol: LiteralUnion<EmptyString | Protocol, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('protocol')
      .toEqualTypeOf<LiteralUnion<EmptyString | Protocol, string>>()
  })

  it('should match [raw: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('raw').toEqualTypeOf<string>()
  })

  it('should match [scope: LiteralUnion<EmptyString, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('scope')
      .toEqualTypeOf<LiteralUnion<EmptyString, string>>()
  })

  it('should match [version: LiteralUnion<EmptyString | SemanticVersion, string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('version')
      .toEqualTypeOf<LiteralUnion<EmptyString | SemanticVersion, string>>()
  })

  it('version_prefix: LiteralUnion<EmptyString | "v", string>', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('version_prefix')
      .toEqualTypeOf<LiteralUnion<EmptyString | 'v', string>>()
  })
})
