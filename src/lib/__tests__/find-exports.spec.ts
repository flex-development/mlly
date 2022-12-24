/**
 * @file Unit Tests - findExports
 * @module mlly/lib/tests/findExports/unit
 */

import { dedent } from 'ts-dedent'
import testSubject from '../find-exports'

describe('unit:lib/findExports', () => {
  it('should return ExportStatement object array', () => {
    // Arrange
    const code: string = dedent`
      export { defineBuildConfig, type BuildConfig } from "#src"
      export type {
        JsonObject,
        LiteralUnion,
        Nullable
      } from '@flex-development/tutils'
      export {
        addFive,
        addFour,
        addThree,
        addTwo,
        squareFive,
        squareFour,
        squareThree,
        squareTwo
      } from './lib'
      export * as constants from "./constants"
      export type { default as Options } from "./options"
      export * from './utils'
      export interface User {}
      export abstract class House {}
      export const { name1, name2: bar } = o;
      export const [ name1, name2 ] = array;
      export default async function foo() {}
      export default foo
      export default 1 + 1;
      export type { Config, Result }
    `

    // Act
    const results = testSubject(code)

    // Expect
    expect(results).to.be.an('array').that.is.not.empty
    expect(results).toMatchSnapshot()
  })
})
