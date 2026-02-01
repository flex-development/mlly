/**
 * @file Type Tests - GetSourceOptions
 * @module mlly/interfaces/tests/unit-d/GetSourceOptions
 */

import type TestSubject from '#interfaces/get-source-options'
import type {
  FileSystem,
  GetSourceHandlers,
  List,
  ModuleFormat
} from '@flex-development/mlly'
import type { Nilable } from '@flex-development/tutils'

describe('unit-d:interfaces/GetSourceOptions', () => {
  it('should allow empty object', () => {
    assertType<TestSubject>({})
  })

  it('should match [format?: ModuleFormat | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('format')
      .toEqualTypeOf<Nilable<ModuleFormat>>()
  })

  it('should match [fs?: FileSystem | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('fs')
      .toEqualTypeOf<Nilable<FileSystem>>()
  })

  it('should match [handlers?: GetSourceHandlers | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('handlers')
      .toEqualTypeOf<Nilable<GetSourceHandlers>>()
  })

  it('should match [ignoreErrors?: boolean | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ignoreErrors')
      .toEqualTypeOf<Nilable<boolean>>()
  })

  it('should match [req?: RequestInit | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('req')
      .toEqualTypeOf<Nilable<RequestInit>>()
  })

  it('should match [schemes?: List<string> | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('schemes')
      .toEqualTypeOf<Nilable<List<string>>>()
  })
})
