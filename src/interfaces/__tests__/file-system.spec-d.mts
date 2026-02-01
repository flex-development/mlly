/**
 * @file Type Tests - FileSystem
 * @module mlly/interfaces/tests/unit-d/FileSystem
 */

import type TestSubject from '#interfaces/file-system'
import type { ReadFile, Realpath, Stat } from '@flex-development/mlly'

describe('unit-d:interfaces/FileSystem', () => {
  it('should match [readFile: ReadFile]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('readFile')
      .toEqualTypeOf<ReadFile>()
  })

  it('should match [realpath: Realpath]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('realpath')
      .toEqualTypeOf<Realpath>()
  })

  it('should match [stat: Stat]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('stat').toEqualTypeOf<Stat>()
  })
})
