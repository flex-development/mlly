/**
 * @file Type Tests - ParseSubpathOptions
 * @module mlly/interfaces/tests/unit-d/ParseSubpathOptions
 */

import type { ModuleId } from '#src/types'
import type TestSubject from '../options-parse-subpath'

describe('unit-d:interfaces/ParseSubpathOptions', () => {
  it('should match [condition?: string]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('condition')
      .toEqualTypeOf<string | undefined>()
  })

  it('should match [conditions?: Set<string> | string[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('conditions')
      .toEqualTypeOf<Set<string> | string[] | undefined>()
  })

  it('should match [dir: ModuleId]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('dir').toEqualTypeOf<ModuleId>()
  })

  it('should match [internal?: boolean]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('internal')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [parent: ModuleId]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parent')
      .toEqualTypeOf<ModuleId>()
  })
})
