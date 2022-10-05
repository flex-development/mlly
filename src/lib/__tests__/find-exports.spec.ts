/**
 * @file Unit Tests - findExports
 * @module mlly/lib/tests/findExports/unit
 */

import dedent from 'ts-dedent'
import testSubject from '../find-exports'

describe('unit:lib/findExports', () => {
  describe('declaration', () => {
    describe('abstract class', () => {
      it('should find export abstract class', () => {
        // Act
        const results = testSubject('export abstract class Person {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare abstract class', () => {
        // Act
        const results = testSubject('export declare abstract class Person {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export abstract class in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export abstract class Person {
           *    public age: number
           *    public name: string
           *    public abstract username: string
           *  }
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export abstract class in single-line comment', () => {
        // Arrange
        const code = '// export abstract class Person {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('async function', () => {
      it('should find export async function', () => {
        // Act
        const results = testSubject('export async function foo {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare async function', () => {
        // Arrange
        const code = 'export declare async function foo(): Promise<void>'

        // Act
        const results = testSubject(code)

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export async function in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export async function foo() {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export async function in single-line comment', () => {
        // Arrange
        const code = '// export async function foo() {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('async function*', () => {
      it('should find export async function*', () => {
        // Act
        const results = testSubject('export async function* foo() {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare async function*', () => {
        // Arrange
        const code = dedent`
          export declare async function* foo(): Generator<Promise<number>>
        `
        // Act
        const results = testSubject(code)

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export async function* in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export async function* foo() {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export async function* in single-line comment', () => {
        // Arrange
        const code = '// export async function* foo() {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('class', () => {
      it('should find export class', () => {
        // Act
        const results = testSubject('export class Point {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare class', () => {
        // Act
        const results = testSubject('export declare class Point {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export class in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export class Point {
           *    public x: number
           *    public y: number
           *  }
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export class in single-line comment', () => {
        // Arrange
        const code = '// export class Point {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('const', () => {
      it('should find export const', () => {
        // Act
        const results = testSubject('export const hello = "world"')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare const', () => {
        // Act
        const results = testSubject('export declare const hello: string')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export const in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export const hello = 'world'
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export const in single-line comment', () => {
        // Arrange
        const code = '// export const hello = "world"'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('const enum', () => {
      it('should find export const enum', () => {
        // Act
        const results = testSubject('export const enum Snack {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare const enum', () => {
        // Act
        const results = testSubject('export declare const enum Snack {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export const enum in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export const enum Snack {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export const enum in single-line comment', () => {
        // Arrange
        const code = '// export const enum Snack {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('default', () => {
      it('should find export default', () => {
        // Act
        const results = testSubject('export default foo')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export default if anonymous', () => {
        // Act
        const results = testSubject('export default () => {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export default in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export default foo
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export default in single-line comment', () => {
        // Arrange
        const code = '// export default foo'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('default async', () => {
      it('should find export default async', () => {
        // Act
        const results = testSubject('export default async () => {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export default async in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export default async () => {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export default async in single-line comment', () => {
        // Arrange
        const code = '// export default async () => {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('default async function', () => {
      it('should find export default async function', () => {
        // Act
        const results = testSubject('export default async function foo() {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export default async function if anonymous', () => {
        // Act
        const results = testSubject('export default async function () {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore default async function in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export default async function () {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore default async function in single-line comment', () => {
        // Arrange
        const code = '// export default async function foo() {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('default async function*', () => {
      it('should find export default async function*', () => {
        // Act
        const results = testSubject('export default async function* foo(n) {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export default async function* if anonymous', () => {
        // Act
        const results = testSubject('export default async function* (n) {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore default async function* in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export default async function* foo(n) {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore default async function* in single-line comment', () => {
        // Arrange
        const code = '// export default async function* foo(n) {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('default function', () => {
      it('should find export default function', () => {
        // Act
        const results = testSubject('export default function foo() {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export default function if anonymous', () => {
        // Act
        const results = testSubject('export default function {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export default function in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export default function foo() {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export default function in single-line comment', () => {
        // Arrange
        const code = '// export default function foo() {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('default function*', () => {
      it('should find export default function*', () => {
        // Act
        const results = testSubject('export default function* foo(n) {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export default function* if anonymous', () => {
        // Act
        const results = testSubject('export default function* (n) {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore default function* in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export default function* foo(n) {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore default function* in single-line comment', () => {
        // Arrange
        const code = '// export default function* foo(n) {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('enum', () => {
      it('should find export enum', () => {
        // Act
        const results = testSubject('export enum ShapeKind {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare enum', () => {
        // Act
        const results = testSubject('export declare enum ShapeKind {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export enum in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export enum ShapeKind {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export enum in single-line comment', () => {
        // Arrange
        const code = '// export enum ShapeKind {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('function', () => {
      it('should find export function', () => {
        // Act
        const results = testSubject('export function foo {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare function', () => {
        // Act
        const results = testSubject('export declare function foo(): void')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export function in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export function foo {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export function in single-line comment', () => {
        // Arrange
        const code = '// export function foo {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('function*', () => {
      it('should find export function*', () => {
        // Act
        const results = testSubject('export function* foo(n) {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare function*', () => {
        // Arrange
        const code = dedent`
          export declare function* foo(n: number): Generator<number>
        `

        // Act
        const results = testSubject(code)

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export function* in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export function* foo(n) {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export function* in single-line comment', () => {
        // Arrange
        const code = '// export function* foo(n) {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('interface', () => {
      it('should find export interface', () => {
        // Act
        const results = testSubject('export interface User {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare interface', () => {
        // Act
        const results = testSubject('export declare interface User {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export interface in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export interface User {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export interface in single-line comment', () => {
        // Arrange
        const code = '// export interface User {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('let', () => {
      it('should find export let', () => {
        // Act
        const results = testSubject('export let x = 1')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare let', () => {
        // Act
        const results = testSubject('export declare let x: number')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export let in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export let x = 1
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export let in single-line comment', () => {
        // Arrange
        const code = '// export let x = 1'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('namespace', () => {
      it('should find export namespace', () => {
        // Act
        const results = testSubject('export namespace Validation {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare namespace', () => {
        // Act
        const results = testSubject('export declare namespace Validation {}')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export namespace in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export namespace Validation {}
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export namespace in single-line comment', () => {
        // Arrange
        const code = '// export namespace Validation {}'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('type', () => {
      it('should find export type', () => {
        // Act
        const results = testSubject('export type Nullable<T> = T | null')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare type', () => {
        // Arrange
        const code = 'export declare type Nullable<T> = T | null'

        // Act
        const results = testSubject(code)

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export type in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export type Nullable<T> = T | null
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export type in single-line comment', () => {
        // Arrange
        const code = '// export type Nullable<T> = T | null'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })

    describe('var', () => {
      it('should find export var', () => {
        // Act
        const results = testSubject('export var k = false')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should find export declare var', () => {
        // Act
        const results = testSubject('export declare var k: boolean')

        // Expect
        expect(results).to.be.an('array').of.length(1)
        expect(results).toMatchSnapshot()
      })

      it('should ignore export var in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export var k = false
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })

      it('should ignore export var in single-line comment', () => {
        // Arrange
        const code = '// export var k = false'

        // Act + Expect
        expect(testSubject(code)).to.be.an('array').of.length(0)
      })
    })
  })

  describe('named', () => {
    it('should find named exports in multi-line statement', () => {
      // Arrange
      const code = dedent`
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
      `

      // Act
      const results = testSubject(code)

      // Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results).toMatchSnapshot()
    })

    it('should find named exports in single-line statement', () => {
      // Act
      const results = testSubject('export { default } from "./make"')

      // Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results).toMatchSnapshot()
    })

    it('should find named type exports in multi-line statement', () => {
      // Arrange
      const code = dedent`
        export type {
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

    it('should find named type exports in single-line statement', () => {
      // Arrange
      const code = 'export type { default as Config } from "./config"'

      // Act
      const results = testSubject(code)

      // Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results).toMatchSnapshot()
    })

    it('should ignore named exports in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  export { DEFAULTS, plugin as default, type Options } from './plugin'
         *  export type { default as Options } from './options'
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.an('array').of.length(0)
    })

    it('should ignore named exports in single-line comment', () => {
      // Arrange
      const code = '// export type { default as Statement } from "./statement"'

      // Act + Expect
      expect(testSubject(code)).to.be.an('array').of.length(0)
    })
  })

  describe('star', () => {
    it('should find star export', () => {
      // Act
      const results = testSubject('export * from "./constants"')

      // Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results).toMatchSnapshot()
    })

    it('should find star export with alias', () => {
      // Arrange
      const code = 'export * as constants from "./constants"'

      // Act
      const results = testSubject(code)

      // Expect
      expect(results).to.be.an('array').of.length(1)
      expect(results).toMatchSnapshot()
    })

    it('should ignore star export in multi-line comment', () => {
      // Arrange
      const code = dedent`
        /**
         * @example
         *  export * from './constants'
         */
      `

      // Act + Expect
      expect(testSubject(code)).to.be.an('array').of.length(0)
    })

    it('should ignore star export in single-line comment', () => {
      // Arrange
      const code = '// export * from "./constants"'

      // Act + Expect
      expect(testSubject(code)).to.be.an('array').of.length(0)
    })
  })
})
