/**
 * @file Unit Tests - ResolveAliasOptions
 * @module mlly/interfaces/tests/unit-d/ResolveAliasOptions
 */

import type { OneOrMany } from '@flex-development/tutils'
import type TestSubject from '../options-resolve-alias'

describe('unit-d:interfaces/ResolveAliasOptions', () => {
  it('should match [baseUrl?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('baseUrl')
      .toEqualTypeOf<string | undefined>()
  })

  it('should match [extensions?: string[] | readonly string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('extensions')
      .toEqualTypeOf<string[] | readonly string[] | undefined>()
  })

  it('should match [fileExists?(this: void, path: string): boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('fileExists')
      .toEqualTypeOf<((this: void, path: string) => boolean) | undefined>()
  })

  it('should match [mainFields?: OneOrMany<string>[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('mainFields')
      .toEqualTypeOf<OneOrMany<string>[] | undefined>()
  })

  it('should match [parent?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parent')
      .toEqualTypeOf<string | undefined>()
  })

  it('should match [paths?: Record<string, string[]>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('paths')
      .toEqualTypeOf<Record<string, string[]> | undefined>()
  })

  it('should match [readFile?(this: void, filename: string): string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('readFile')
      .toEqualTypeOf<((this: void, filename: string) => string) | undefined>()
  })

  it('should match [tsconfig?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tsconfig')
      .toEqualTypeOf<string | undefined>()
  })
})
