/**
 * @file Unit Tests - isExportsSugar
 * @module mlly/utils/tests/unit/isExportsSugar
 */

import type { ModuleId } from '#src/types'
import pathe from '@flex-development/pathe'
import type { Exports } from '@flex-development/pkg-types'
import { URL, pathToFileURL } from 'node:url'
import testSubject from '../is-exports-sugar'

describe('unit:utils/isExportsSugar', () => {
  let parent: ModuleId
  let pkg: URL

  beforeEach(() => {
    parent = import.meta.url
    pkg = new URL('package.json', pathToFileURL('.' + pathe.sep))
  })

  it('should return false if exports does not use exports sugar', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[0][] = [
      null,
      undefined,
      faker.datatype.number() as unknown as Exports,
      { '.': './dist/index.mjs', './package.json': './package.json' }
    ]

    // Act + Expect
    cases.forEach(exports => {
      return expect(testSubject(exports, pkg, parent)).to.be.false
    })
  })

  it('should return true if exports uses exports sugar', () => {
    // Arrange
    const cases: Parameters<typeof testSubject>[0][] = [
      './dist/index.mjs',
      ['./dist/index.mjs'],
      { import: './dist/index.mjs', require: './dist/index.cjs' }
    ]

    // Act + Expect
    cases.forEach(exports => {
      return expect(testSubject(exports, pkg, parent)).to.be.true
    })
  })
})
