/**
 * @file Type Tests - ParseSubpathOptions
 * @module mlly/interfaces/tests/unit-d/ParseSubpathOptions
 */

import type { ModuleId } from '#src/types'
import type { Optional } from '@flex-development/tutils'
import type TestSubject from '../options-parse-subpath'

describe('unit-d:interfaces/ParseSubpathOptions', () => {
  it('should match [condition?: Optional<string>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('condition')
      .toEqualTypeOf<Optional<string>>()
  })

  it('should match [conditions?: Optional<Set<string> | string[]>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('conditions')
      .toEqualTypeOf<Optional<Set<string> | string[]>>()
  })

  it('should match [dir: ModuleId]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('dir').toEqualTypeOf<ModuleId>()
  })

  it('should match [internal?: Optional<boolean>]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('internal')
      .toEqualTypeOf<Optional<boolean>>()
  })

  it('should match [parent: ModuleId]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parent')
      .toEqualTypeOf<ModuleId>()
  })
})
