/**
 * @file Unit Tests - getSubpaths
 * @module mlly/internal/tests/unit/getSubpaths
 */

import exports from '#fixtures/package-exports'
import imports from '#fixtures/package-imports'
import type { ModuleId } from '#src/types'
import type { Exports, Imports } from '@flex-development/pkg-types'
import type { Nilable } from '@flex-development/tutils'
import { pathToFileURL } from 'node:url'
import testSubject from '../get-subpaths'

describe('unit:internal/getSubpaths', () => {
  let parent: ModuleId
  let pkg: ModuleId

  beforeEach(() => {
    pkg = pathToFileURL('package.json')
    parent = import.meta.url
  })

  it('should return array containing defined subpaths', () => {
    // Arrange
    const cases: [Nilable<Exports | Imports>, boolean, string[]][] = [
      ['./dist/index.mjs', false, ['.']],
      [['./dist/index.mjs'], false, ['.']],
      [exports, false, Object.keys(exports)],
      [imports, true, Object.keys(imports)],
      [null, false, []],
      [undefined, false, []],
      [{ import: './dist/index.mjs' }, false, ['.']]
    ]

    // Act + Expect
    cases.forEach(([ctx, internal, expected]) => {
      expect(testSubject(ctx, internal, pkg, parent)).to.deep.equal(expected)
    })
  })
})
