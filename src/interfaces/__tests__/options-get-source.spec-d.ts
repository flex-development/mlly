/**
 * @file Type Tests - GetSourceOptions
 * @module mlly/interfaces/tests/unit-d/GetSourceOptions
 */

import type { Format } from '#src/enums'
import type { KeysRequired } from '@flex-development/tutils'
import type { RequestInit } from 'node-fetch'
import type TestSubject from '../options-get-source'

describe('unit-d:interfaces/GetSourceOptions', () => {
  it('should allow empty object', () => {
    expectTypeOf<KeysRequired<TestSubject>>().toBeNever()
  })

  it('should match [experimental_network_imports?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('experimental_network_imports')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [format?: Format | Lowercase<keyof typeof Format>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('format')
      .toEqualTypeOf<Format | Lowercase<keyof typeof Format> | undefined>()
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
