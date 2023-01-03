/**
 * @file Unit Tests - findStaticImports
 * @module mlly/utils/tests/unit/findStaticImports
 */

import { dedent } from 'ts-dedent'
import testSubject from '../find-static-imports'

describe('unit:utils/findStaticImports', () => {
  it('should return StaticImport object array', () => {
    // Arrange
    const code: string = dedent`
      import { defineBuildConfig, type Config } from '@flex-development/mkbuild'
      import type {
        Join,
        Nullable,
        Opaque,
        Simplify
      } from '@flex-development/tutils'
      import * as color from 'colorette'
      import consola from 'consola'
      import tsconfig from './tsconfig.json' assert { type: 'json' }
      import { export1, export2 as alias2 } from "module-name";
      import { 'string name' as alias } from "module-name";
      import defaultExport, { export1 } from "module-name";
      import defaultExport, * as name from "module-name";
      import { "h-i" as hi } from './hi.js'
    `

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').that.is.not.empty
    expect(results).toMatchSnapshot()
  })
})
