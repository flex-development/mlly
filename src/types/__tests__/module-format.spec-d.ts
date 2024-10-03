/**
 * @file Type Tests - ModuleFormat
 * @module mlly/types/tests/unit-d/ModuleFormat
 */

import type TestSubject from '#types/module-format'
import type { ModuleFormatMap } from '@flex-development/mlly'

describe('unit-d:types/ModuleFormat', () => {
  it('should equal ModuleFormatMap[keyof ModuleFormatMap]', () => {
    expectTypeOf<TestSubject>()
      .toEqualTypeOf<ModuleFormatMap[keyof ModuleFormatMap]>()
  })
})
