/**
 * @file Unit Tests - getSubpaths
 * @module mlly/internal/tests/unit/getSubpaths
 */

import type { ModuleId } from '#src/types'
import getPackageJson from '#tests/utils/get-package-json'
import type { Exports, Imports, PackageJson } from '@flex-development/pkg-types'
import { pathToFileURL } from 'node:url'
import testSubject from '../get-subpaths'

describe('unit:internal/getSubpaths', () => {
  let parent: ModuleId
  let pkg: ModuleId
  let pkgjson: PackageJson & { name: string }

  beforeEach(() => {
    pkg = pathToFileURL('package.json')
    parent = import.meta.url
    pkgjson = getPackageJson(pkg) as typeof pkgjson
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
