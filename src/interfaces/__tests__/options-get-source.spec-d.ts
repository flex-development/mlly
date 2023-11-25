/**
 * @file Type Tests - GetSourceOptions
 * @module mlly/interfaces/tests/unit-d/GetSourceOptions
 */

import type { Format } from '#src/enums'
import type {
  Optional,
  OrLowercase,
  RequiredKeys
} from '@flex-development/tutils'
import type TestSubject from '../options-get-source'

describe('unit-d:interfaces/GetSourceOptions', () => {
  it('should allow empty object', () => {
    expectTypeOf<RequiredKeys<TestSubject>>().toBeNever()
  })

  it('should match [experimental_network_imports?: Optional<boolean>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('experimental_network_imports')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [format?: Optional<OrLowercase<Format>>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('format')
      .toEqualTypeOf<Optional<OrLowercase<Format>>>()
  })

  it('should match [ignore_errors?: Optional<boolean>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ignore_errors')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [req?: Optional<RequestInit>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('req')
      .toEqualTypeOf<Optional<RequestInit>>()
  })
})
