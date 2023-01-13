/**
 * @file Type Tests - GetFormatOptions
 * @module mlly/interfaces/tests/unit-d/GetFormatOptions
 */

import type { Format } from '#src/enums'
import type { Ext } from '@flex-development/pathe'
import type { EmptyString, KeysRequired } from '@flex-development/tutils'
import type { RequestInit } from 'node-fetch'
import type { URL } from 'node:url'
import type TestSubject from '../options-get-format'

describe('unit-d:interfaces/GetFormatOptions', () => {
  it('should allow empty object', () => {
    expectTypeOf<KeysRequired<TestSubject>>().toBeNever()
  })

  it('should match [base?: URL | string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('base')
      .toEqualTypeOf<URL | string | undefined>()
  })

  it('should match [experimental_json_modules?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('experimental_json_modules')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [experimental_network_imports?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('experimental_network_imports')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [experimental_wasm_modules?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('experimental_wasm_modules')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [extension_format_map?: Map<EmptyString | Ext, Format>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('extension_format_map')
      .toEqualTypeOf<Map<EmptyString | Ext, Format> | undefined>()
  })

  it('should match [ignore_errors?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ignore_errors')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [req?: RequestInit]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('req')
      .toEqualTypeOf<RequestInit | undefined>()
  })
})
