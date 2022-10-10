/**
 * @file Unit Tests - getCompilerOptions
 * @module mlly/lib/tests/getCompilerOptions/unit
 */

import type { Spy, Testcase } from '#tests/interfaces'
import path from 'node:path'
import * as loader from 'tsconfig-paths/lib/tsconfig-loader'
import ts from 'typescript'
import testSubject from '../get-compiler-options'

vi.mock('tsconfig-paths/lib/tsconfig-loader')

describe('unit:lib/getCompilerOptions', () => {
  const loadTsconfig = loader.loadTsconfig as unknown as Spy

  it('should return empty object is tsconfig is not found', () => {
    // Arrange
    loadTsconfig.mockImplementationOnce(() => void 0)

    // Act + Expect
    expect(testSubject()).to.deep.equal({})
  })

  it('should return empty object if user options are not found', () => {
    // Arrange
    loadTsconfig.mockImplementationOnce(() => ({}))

    // Act + Expect
    expect(testSubject()).to.deep.equal({})
  })

  it('should return user options', () => {
    // Arrange
    const compilerOptions = { module: 'esnext' }
    const tsconfig = { compilerOptions }
    loadTsconfig.mockImplementationOnce(() => tsconfig)

    // Act + Expect
    expect(testSubject()).to.deep.equal(compilerOptions)
  })

  describe('normalization', () => {
    const tsconfig: string = path.resolve('tsconfig.json')

    describe('importsNotUsedAsValues', () => {
      interface Case
        extends Testcase<keyof typeof ts['ImportsNotUsedAsValues']> {
        importsNotUsedAsValues: 'error' | 'preserve' | 'remove'
      }

      const cases: Case[] = [
        { expected: 'Error', importsNotUsedAsValues: 'error' },
        { expected: 'Preserve', importsNotUsedAsValues: 'preserve' },
        { expected: 'Remove', importsNotUsedAsValues: 'remove' }
      ]

      cases.forEach(({ expected, importsNotUsedAsValues }) => {
        const value = `ImportsNotUsedAsValues.${expected}`

        it(`should convert ${pf(importsNotUsedAsValues)} to ${value}`, () => {
          // Arrange
          const compilerOptions = { importsNotUsedAsValues }

          // Act
          loadTsconfig.mockImplementationOnce(() => ({ compilerOptions }))
          const result = testSubject(tsconfig, ts)

          // Expect
          expect(result).deep.equal({
            importsNotUsedAsValues: ts.ImportsNotUsedAsValues[expected]
          })
        })
      })
    })

    describe('jsx', () => {
      interface Case extends Testcase<keyof typeof ts['JsxEmit']> {
        jsx:
          | 'preserve'
          | 'react-jsx'
          | 'react-jsxdev'
          | 'react-native'
          | 'react'
      }

      const cases: Case[] = [
        { expected: 'Preserve', jsx: 'preserve' },
        { expected: 'React', jsx: 'react' },
        { expected: 'ReactJSX', jsx: 'react-jsx' },
        { expected: 'ReactJSXDev', jsx: 'react-jsxdev' },
        { expected: 'ReactNative', jsx: 'react-native' }
      ]

      cases.forEach(({ expected, jsx }) => {
        it(`should convert ${pf(jsx)} to JsxEmit.${expected}`, () => {
          // Arrange
          const compilerOptions = { jsx }

          // Act
          loadTsconfig.mockImplementationOnce(() => ({ compilerOptions }))
          const result = testSubject(tsconfig, ts)

          // Expect
          expect(result).deep.equal({ jsx: ts.JsxEmit[expected] })
        })
      })
    })

    describe('lib', () => {
      it('should convert libs into typescript library file names', () => {
        // Arrange
        loadTsconfig.mockImplementationOnce(() => ({
          compilerOptions: { lib: ['es2021'] }
        }))

        // Act + Expect
        expect(testSubject(tsconfig, ts).lib).deep.equal(['lib.es2021.d.ts'])
      })
    })

    describe('module', () => {
      interface Case extends Testcase<keyof typeof ts['ModuleKind']> {
        module:
          | 'amd'
          | 'commonjs'
          | 'es2015'
          | 'es2020'
          | 'es2022'
          | 'esnext'
          | 'node16'
          | 'nodenext'
          | 'none'
          | 'system'
          | 'umd'
      }

      const cases: Case[] = [
        { expected: 'AMD', module: 'amd' },
        { expected: 'CommonJS', module: 'commonjs' },
        { expected: 'ES2015', module: 'es2015' },
        { expected: 'ES2020', module: 'es2020' },
        { expected: 'ES2022', module: 'es2022' },
        { expected: 'ESNext', module: 'esnext' },
        { expected: 'Node16', module: 'node16' },
        { expected: 'NodeNext', module: 'nodenext' },
        { expected: 'None', module: 'none' },
        { expected: 'System', module: 'system' },
        { expected: 'UMD', module: 'umd' }
      ]

      cases.forEach(({ expected, module: mod }) => {
        it(`should convert ${pf(mod)} to ModuleKind.${expected}`, () => {
          // Arrange
          const compilerOptions = { module: mod }

          // Act
          loadTsconfig.mockImplementationOnce(() => ({ compilerOptions }))
          const result = testSubject(tsconfig, ts)

          // Expect
          expect(result).deep.equal({ module: ts.ModuleKind[expected] })
        })
      })
    })

    describe('moduleDetection', () => {
      interface Case extends Testcase<keyof typeof ts['ModuleDetectionKind']> {
        moduleDetection: 'auto' | 'force' | 'legacy'
      }

      const cases: Case[] = [
        { expected: 'Auto', moduleDetection: 'auto' },
        { expected: 'Force', moduleDetection: 'force' },
        { expected: 'Legacy', moduleDetection: 'legacy' }
      ]

      cases.forEach(({ expected, moduleDetection }) => {
        const value = `ModuleDetectionKind.${expected}`

        it(`should convert ${pf(moduleDetection)} to ${value}`, () => {
          // Arrange
          const compilerOptions = { moduleDetection }

          // Act
          loadTsconfig.mockImplementationOnce(() => ({ compilerOptions }))
          const result = testSubject(tsconfig, ts)

          // Expect
          expect(result).deep.equal({
            moduleDetection: ts.ModuleDetectionKind[expected]
          })
        })
      })
    })

    describe('moduleResolution', () => {
      interface Case extends Testcase<keyof typeof ts['ModuleResolutionKind']> {
        moduleResolution: 'classic' | 'node' | 'node16' | 'nodenext'
      }

      const cases: Case[] = [
        { expected: 'Classic', moduleResolution: 'classic' },
        { expected: 'NodeJs', moduleResolution: 'node' },
        { expected: 'Node16', moduleResolution: 'node16' },
        { expected: 'NodeNext', moduleResolution: 'nodenext' }
      ]

      cases.forEach(({ expected, moduleResolution }) => {
        const value = `ModuleResolutionKind.${expected}`

        it(`should convert ${pf(moduleResolution)} to ${value}`, () => {
          // Arrange
          const compilerOptions = { moduleResolution }

          // Act
          loadTsconfig.mockImplementationOnce(() => ({ compilerOptions }))
          const result = testSubject(tsconfig, ts)

          // Expect
          expect(result).deep.equal({
            moduleResolution: ts.ModuleResolutionKind[expected]
          })
        })
      })
    })

    describe('newLine', () => {
      interface Case extends Testcase<keyof typeof ts['NewLineKind']> {
        newLine: 'crlf' | 'lf'
      }

      const cases: Case[] = [
        { expected: 'CarriageReturnLineFeed', newLine: 'crlf' },
        { expected: 'LineFeed', newLine: 'lf' }
      ]

      cases.forEach(({ expected, newLine }) => {
        it(`should convert ${pf(newLine)} to NewLineKind.${expected}`, () => {
          // Arrange
          const compilerOptions = { newLine }

          // Act
          loadTsconfig.mockImplementationOnce(() => ({ compilerOptions }))
          const result = testSubject(tsconfig, ts)

          // Expect
          expect(result).deep.equal({ newLine: ts.NewLineKind[expected] })
        })
      })
    })

    describe('target', () => {
      interface Case extends Testcase<keyof typeof ts['ScriptTarget']> {
        target:
          | 'es3'
          | 'es5'
          | 'es2015'
          | 'es2016'
          | 'es2017'
          | 'es2018'
          | 'es2019'
          | 'es2020'
          | 'es2021'
          | 'es2022'
          | 'esnext'
      }

      const cases: Case[] = [
        { expected: 'ES3', target: 'es3' },
        { expected: 'ES5', target: 'es5' },
        { expected: 'ES2015', target: 'es2015' },
        { expected: 'ES2016', target: 'es2016' },
        { expected: 'ES2017', target: 'es2017' },
        { expected: 'ES2018', target: 'es2018' },
        { expected: 'ES2019', target: 'es2019' },
        { expected: 'ES2020', target: 'es2020' },
        { expected: 'ES2021', target: 'es2021' },
        { expected: 'ES2022', target: 'es2022' },
        { expected: 'ESNext', target: 'esnext' }
      ]

      cases.forEach(({ expected, target }) => {
        it(`should convert ${pf(target)} to ScriptTarget.${expected}`, () => {
          // Arrange
          const compilerOptions = { target }

          // Act
          loadTsconfig.mockImplementationOnce(() => ({ compilerOptions }))
          const result = testSubject(tsconfig, ts)

          // Expect
          expect(result).deep.equal({ target: ts.ScriptTarget[expected] })
        })
      })
    })
  })
})
