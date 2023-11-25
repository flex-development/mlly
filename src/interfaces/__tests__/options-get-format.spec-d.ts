/**
 * @file Type Tests - GetFormatOptions
 * @module mlly/interfaces/tests/unit-d/GetFormatOptions
 */

import type { Format } from '#src/enums'
import type { Ext } from '@flex-development/pathe'
import type {
  EmptyString,
  Optional,
  RequiredKeys
} from '@flex-development/tutils'
import type TestSubject from '../options-get-format'

describe('unit-d:interfaces/GetFormatOptions', () => {
  it('should allow empty object', () => {
    expectTypeOf<RequiredKeys<TestSubject>>().toBeNever()
  })

  it('should match [experimental_json_modules?: Optional<boolean>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('experimental_json_modules')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [experimental_network_imports?: Optional<boolean>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('experimental_network_imports')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [experimental_wasm_modules?: Optional<boolean>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('experimental_wasm_modules')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [extension_format_map?: Optional<Map<EmptyString | Ext, Format>>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('extension_format_map')
      .toEqualTypeOf<Optional<Map<EmptyString | Ext, Format>>>()
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
