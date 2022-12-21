/**
 * @file Unit Tests - findStaticImports
 * @module mlly/lib/tests/findStaticImports/unit
 */

import { dedent } from 'ts-dedent'
import testSubject from '../find-static-imports'

describe('unit:lib/findStaticImports', () => {
  it('should find default static import', () => {
    // Act
    const results = testSubject('import pb from "pretty-bytes"')

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find default type import', () => {
    // Arrange
    const code = dedent`
      import type Nullable from '@flex-development/tutils/types/nullable'
    `

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find named static imports in multi-line statement', () => {
    // Arrange
    const code = dedent`
      import {
        addFive,
        addFour,
        addThree,
        addTwo,
        squareFive,
        squareFour,
        squareThree,
        squareTwo
      } from './lib'
    `

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find named static imports in single-line statement', () => {
    // Arrange
    const code = 'import { readPackage, type PackageJson } from "read-pkg"'

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find named type imports in multi-line statement', () => {
    // Arrange
    const code = dedent`
      import type {
        BuildOptions,
        BuildResult,
        OutputFile,
        Plugin,
        PluginBuild
      } from 'esbuild'
    `

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find named type imports in single-line statement', () => {
    // Arrange
    const code = dedent`
      import type { Join, Nullable, Overwrite } from '@flex-development/tutils'
    `

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should find star static import', () => {
    // Act
    const results = testSubject('import * as color from "colorette"')

    // Expect
    expect(results).to.be.an('array').of.length(1)
    expect(results).toMatchSnapshot()
  })

  it('should ignore static import in multi-line comment', () => {
    // Arrange
    const code = dedent`
      /**
       * @example
       *  import write from './utils/write'
       *	await write(result, fs)
       */
    `

    // Act + Expect
    expect(testSubject(code)).to.be.an('array').of.length(0)
  })

  it('should ignore static import in single-line comment', () => {
    // Arrange
    const code = '// import fse from "fs-extra"'

    // Act + Expect
    expect(testSubject(code)).to.be.an('array').of.length(0)
  })
})
