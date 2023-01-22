/**
 * @file Unit Tests - getSubpaths
 * @module mlly/internal/tests/unit/getSubpaths
 */

import type { ModuleId } from '#src/types'
import type { Exports, Imports, PackageJson } from '@flex-development/pkg-types'
import fs from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import testSubject from '../get-subpaths'

describe('unit:internal/getSubpaths', () => {
  let parent: ModuleId
  let pkg: ModuleId
  let pkgjson: PackageJson & { name: string }

  beforeEach(async () => {
    pkg = pathToFileURL('package.json')
    parent = import.meta.url
    pkgjson = JSON.parse(await fs.readFile('package.json', 'utf8'))
  })

  it('should return array containing defined subpaths', () => {
    // Arrange
    const cases: [Exports | Imports | undefined, boolean, string[]][] = [
      [null, false, []],
      [undefined, false, []],
      ['./dist/index.mjs', false, ['.']],
      [['./dist/index.mjs'], false, ['.']],
      [{ import: './dist/index.mjs' }, false, ['.']],
      [pkgjson.exports, false, Object.keys(pkgjson.exports!)],
      [pkgjson.imports, true, Object.keys(pkgjson.imports!)]
    ]

    // Act + Expect
    cases.forEach(([ctx, internal, expected]) => {
      expect(testSubject(ctx, internal, pkg, parent)).to.deep.equal(expected)
    })
  })
})
