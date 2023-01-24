/**
 * @file Unit Tests - hasESMSyntax
 * @module mlly/utils/tests/unit/hasESMSyntax
 */

import { dedent } from 'ts-dedent'
import testSubject from '../has-esm-syntax'

describe('unit:utils/hasESMSyntax', () => {
  describe('export', () => {
    describe('declaration', () => {
      it('should detect declaration export abstract class', () => {
        expect(testSubject('export abstract class Node<T> {}')).to.be.true
      })

      it('should detect declaration export async function', () => {
        // Arrange
        const code = dedent`
          export async function run(): Promise<void> {}
        `

        // Act + Expect
        expect(testSubject(code)).to.be.true
      })

      it('should detect declaration export class', () => {
        expect(testSubject('export class LinkedList<T> {}')).to.be.true
      })

      it('should detect declaration export const', () => {
        expect(testSubject('export const fizz = 4')).to.be.true
      })

      it('should detect declaration export default', () => {
        expect(testSubject('export default foo')).to.be.true
      })

      it('should detect declaration export enum', () => {
        // Arrange
        const code = dedent`
          export enum Snack {
            Apple = 0,
            Banana = 1,
            Orange = 2,
            Other = 3
          }
        `

        // Act + Expect
        expect(testSubject(code)).to.be.true
      })

      it('should detect declaration export function', () => {
        // Arrange
        const code = dedent`
          export function hello(name?: string = "world"): string {
            return \`hello, \${name}\`
          }
        `

        // Act + Expect
        expect(testSubject(code)).to.be.true
      })

      it('should detect declaration export interface', () => {
        // Arrange
        const code = dedent`
          export interface IListNode<T> {
            next: IListNode<T> | null
            prev?: IListNode<T> | null
            val: T
            toJSON(): T[]
            toString(): string
          }
        `

        // Act + Expect
        expect(testSubject(code)).to.be.true
      })

      it('should detect declaration export let', () => {
        expect(testSubject('export let state = 5')).to.be.true
      })

      it('should detect declaration export type', () => {
        // Arrange
        const code = dedent`
          export type OutputExtension = '.cjs' | '.js' | '.mjs'
        `

        // Act + Expect
        expect(testSubject(code)).to.be.true
      })

      it('should detect declaration export var', () => {
        expect(testSubject('export var state = 15')).to.be.true
      })

      it('should ignore declaration export in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export { default } from './foo'
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })

      it('should ignore declaration export in single-line comment', () => {
        expect(testSubject('//  export { default } from "./foo"')).to.be.false
      })
    })

    describe('default', () => {
      it('should detect default export', () => {
        expect(testSubject('export default foo')).to.be.true
      })

      it('should ignore default export in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export default foo
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })

      it('should ignore default export in single-line comment', () => {
        expect(testSubject('// export default foo')).to.be.false
      })
    })

    describe('named', () => {
      let specifier: string

      beforeAll(() => {
        specifier = 'fs-extra'
      })

      it('should detect named export', () => {
        expect(testSubject(`export { mkdirp } from "${specifier}"`)).to.be.true
      })

      it('should detect named exports spanning multiple lines', () => {
        // Arrange
        const code = dedent`
          import {
            mkdirp,
            readFile,
            unlink,
            writeFile
          } from '${specifier}'
        `

        // Act + Expect
        expect(testSubject(code)).to.be.true
      })

      it('should ignore named export in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export { mkdirp } from "${specifier}"
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })

      it('should ignore named export in single-line comment', () => {
        // Arrange
        const code: string = `// export { mkdirp } from "${specifier}"`

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })
    })

    describe('star', () => {
      let specifier: string

      beforeAll(() => {
        specifier = '@flex-development/tsconfig-types'
      })

      it('should detect star export', () => {
        expect(testSubject(`export * as tsc from "${specifier}"`)).to.be.true
      })

      it('should ignore star export in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  export * as tsc from "${specifier}"
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })

      it('should ignore star export in single-line comment', () => {
        // Arrange
        const code: string = `// export * as tsc from '${specifier}'`

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })
    })
  })

  describe('import', () => {
    describe('default', () => {
      let specifier: string

      beforeAll(() => {
        specifier = '@flex-development/pkg-types'
      })

      it('should detect default import', () => {
        expect(testSubject(`import pkg from "${specifier}"`)).to.be.true
      })

      it('should ignore default import in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  import pkg from "${specifier}"
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })

      it('should ignore default import in single-line comment', () => {
        expect(testSubject(`// import pkg from "${specifier}"`)).to.be.false
      })
    })

    describe('dynamic', () => {
      let specifier: string

      beforeAll(() => {
        specifier = '@flex-development/errnode'
      })

      it('should detect dynamic import', () => {
        expect(testSubject(`await import("${specifier}")`)).to.be.true
      })

      it('should ignore dynamic import in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  const {
           *    ERR_INVALID_MODULE_SPECIFIER,
           *    ERR_INVALID_PACKAGE_CONFIG,
           *    ERR_INVALID_PACKAGE_TARGET,
           *    ERR_MODULE_NOT_FOUND,
           *    ERR_PACKAGE_IMPORT_NOT_DEFINED,
           *    ERR_PACKAGE_PATH_NOT_EXPORTED,
           *    ERR_UNSUPPORTED_DIR_IMPORT,
           *    ErrorCode
           *  } = await import("${specifier}")
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })

      it('should ignore dynamic import in single-line comment', () => {
        expect(testSubject(`// await import("${specifier}")`)).to.be.false
      })
    })

    describe('named', () => {
      let specifier: string

      beforeAll(() => {
        specifier = '@flex-development/pathe'
      })

      it('should detect named import', () => {
        expect(testSubject(`import { resolve } from "${specifier}"`)).to.be.true
      })

      it('should detect named imports spanning multiple lines', () => {
        // Arrange
        const code = dedent`
          import {
            basename,
            dirname,
            extname,
            resolve
          } from '${specifier}'
        `

        // Act + Expect
        expect(testSubject(code)).to.be.true
      })

      it('should ignore named import in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  import { resolve } from '${specifier}'
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })

      it('should ignore named import in single-line comment', () => {
        // Arrange
        const code = `// import { resolve } from "${specifier}"`

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })
    })

    describe('star', () => {
      let specifier: string

      beforeAll(() => {
        specifier = '@flex-development/tutils'
      })

      it('should detect star import', () => {
        expect(testSubject(`import * as t from "${specifier}"`)).to.be.true
      })

      it('should ignore star import in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  import * as t from "${specifier}"
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })

      it('should ignore star import in single-line comment', () => {
        expect(testSubject(`// import * as t from "${specifier}"`)).to.be.false
      })
    })
  })

  describe('import.meta', () => {
    describe('env', () => {
      it('should detect import.meta.env', () => {
        expect(testSubject('console.debug(import.meta.env)')).to.be.true
      })

      it('should detect import.meta.env property', () => {
        expect(testSubject('console.log(import.meta.env.DEV)')).to.be.true
      })

      it('should ignore import.meta.env in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * \`\`\`js
           *  console.log(import.meta.env.VITE_SOME_KEY) // 123
           *  console.log(import.meta.env.DB_PASSWORD) // undefined
           * \`\`\`
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })

      it('should ignore import.meta.env in single-line comment', () => {
        expect(testSubject('// console.info(import.meta.env)')).to.be.false
      })
    })

    describe('resolve', () => {
      it('should detect import.meta.resolve', () => {
        expect(testSubject('await import.meta.resolve("asset.css")')).to.be.true
      })

      it('should ignore import.meta.resolve in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  const asset = await import.meta.resolve('asset.css')
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })

      it('should ignore import.meta.resolve in single-line comment', () => {
        expect(testSubject('// import.meta.resolve("asset.css")')).to.be.false
      })
    })

    describe('url', () => {
      it('should detect import.meta.url', () => {
        // Arrange
        const code = dedent`
          const piscina = new Piscina({
            filename: new URL('./worker.mjs', import.meta.url).href
          })
        `

        // Act + Expect
        expect(testSubject(code)).to.be.true
      })

      it('should ignore import.meta.url in multi-line comment', () => {
        // Arrange
        const code = dedent`
          /**
           * @example
           *  const piscina = new Piscina({
           *    filename: new URL('./worker.mjs', import.meta.url).href
           *  })
           */
        `

        // Act + Expect
        expect(testSubject(code)).to.be.false
      })

      it('should ignore import.meta.url in single-line comment', () => {
        expect(testSubject('// const url = import.meta.url')).to.be.false
      })
    })
  })
})
