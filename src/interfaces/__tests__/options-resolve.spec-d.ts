/**
 * @file Unit Tests - ResolveOptions
 * @module mlly/interfaces/tests/unit-d/ResolveOptions
 */

import type { ModuleSpecifierType } from '#src/types'
import type { Ext } from '@flex-development/pathe'
import type { EmptyString } from '@flex-development/tutils'
import type TestSubject from '../options-resolve'

describe('unit-d:interfaces/ResolveOptions', () => {
  it('should match [conditions?: Set<string> | string[] | readonly string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('conditions')
      .toEqualTypeOf<Set<string> | string[] | readonly string[] | undefined>()
  })

  it('should match [ext?: Ext | Function | false]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ext')
      .toEqualTypeOf<
        | Ext
        | false
        | ((
            specifier: string,
            resolved: string
          ) => EmptyString | Ext | PromiseLike<EmptyString | Ext>)
        | undefined
      >()
  })

  it('should match [extensions?: string[] | readonly string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('extensions')
      .toEqualTypeOf<string[] | readonly string[] | undefined>()
  })

  it('should match [parent?: URL | string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parent')
      .toEqualTypeOf<URL | string | undefined>()
  })

  it('should match [preserveSymlinks?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preserveSymlinks')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [type?: Function | ModuleSpecifierType]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('type')
      .toEqualTypeOf<
        | ModuleSpecifierType
        | ((
            resolved: string
          ) => ModuleSpecifierType | PromiseLike<ModuleSpecifierType>)
        | undefined
      >()
  })
})
