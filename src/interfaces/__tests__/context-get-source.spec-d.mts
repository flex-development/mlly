/**
 * @file Type Tests - GetSourceContext
 * @module mlly/interfaces/tests/unit-d/GetSourceContext
 */

import type TestSubject from '#interfaces/context-get-source'
import type {
  FileSystem,
  GetSourceHandlers,
  GetSourceOptions
} from '@flex-development/mlly'

describe('unit-d:interfaces/GetSourceContext', () => {
  it('should extend GetSourceOptions', () => {
    expectTypeOf<TestSubject>().toMatchTypeOf<GetSourceOptions>()
  })

  it('should match [error: boolean]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('error').toEqualTypeOf<boolean>()
  })

  it('should match [fs: FileSystem]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('fs').toEqualTypeOf<FileSystem>()
  })

  it('should match [handlers: GetSourceHandlers]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('handlers')
      .toEqualTypeOf<GetSourceHandlers>()
  })

  it('should match [req: RequestInit]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('req')
      .toEqualTypeOf<RequestInit>()
  })

  it('should match [schemes: Set<string>', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('schemes')
      .toEqualTypeOf<Set<string>>()
  })
})
