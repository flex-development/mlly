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
      import * as pathe from '@flex-development/pathe'
      import type {
        Join,
        Nullable,
        Opaque,
        Simplify
      } from '@flex-development/tutils'
      import consola from 'consola'
      import { export1, export2 as alias2 } from "module-name";
      import { 'string name' as alias } from "module-name";
      import defaultExport, { export1 } from "module-name";
      import defaultExport, * as name from "module-name";
      import color from 'tinyrainbow'
      import { "h-i" as hi } from './hi.js'
      import './side-effect.mjs'
      import tsconfig from './tsconfig.json' assert { type: 'json' }
    `

    // Act
    const result = testSubject(code)

    // Expect
    expect(result).to.be.an('array').that.is.not.empty
    expect(result).toMatchSnapshot()
  })
})
