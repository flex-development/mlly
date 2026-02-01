/**
 * @file Type Tests - Stats
 * @module mlly/interfaces/tests/unit-d/Stats
 */

import type TestSubject from '#interfaces/stats'
import type { IsDirectory, IsFile } from '@flex-development/mlly'

describe('unit-d:interfaces/Stats', () => {
  it('should match [isDirectory: IsDirectory]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('isDirectory')
      .toEqualTypeOf<IsDirectory>()
  })

  it('should match [isFile: IsFile]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('isFile')
      .toEqualTypeOf<IsFile>()
  })
})
