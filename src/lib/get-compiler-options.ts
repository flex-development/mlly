/**
 * @file getCompilerOptions
 * @module mlly/lib/getCompilerOptions
 */

import type { CompilerOptionsJson } from '#src/interfaces'
import { loadTsconfig } from 'tsconfig-paths/lib/tsconfig-loader'
import type { CompilerOptions } from 'typescript'
import upath from 'upath'

/**
 * Retrieves TypeScript compiler options from `path`.
 *
 * Supports [`extends`][1].
 *
 * Normalizes compiler options so that options are suitable for a TypeScript
 * program if `ts` is passed.
 *
 * [1]: https://typescriptlang.org/tsconfig#extends
 *
 * @param {string} [path=upath.resolve('tsconfig.json')] - Tsconfig path
 * @param {typeof import('typescript')} [ts] - TypeScript module
 * @return {CompilerOptions | CompilerOptionsJson} TypeScript compiler options
 */
const getCompilerOptions = (
  path: string = upath.resolve('tsconfig.json'),
  ts?: typeof import('typescript')
): CompilerOptions | CompilerOptionsJson => {
  /**
   * Tsconfig object.
   *
   * @const {{ compilerOptions?: CompilerOptionsJson } | undefined} t
   */
  const t: { compilerOptions?: CompilerOptionsJson } | undefined =
    loadTsconfig(path)

  // do nothing if missing tsconfig or initial options
  if (!t?.compilerOptions) return {}

  // normalize user compiler options
  if (ts) {
    const {
      ImportsNotUsedAsValues,
      JsxEmit,
      ModuleDetectionKind,
      ModuleKind,
      ModuleResolutionKind,
      NewLineKind,
      ScriptTarget
    } = ts

    // get compiler options
    const { compilerOptions } = t as {
      compilerOptions: CompilerOptions
    }

    // typescript program expects lib names to match node_modules exactly
    if (Array.isArray(compilerOptions.lib)) {
      compilerOptions.lib = compilerOptions.lib.map((name: string) => {
        return `lib.${name}.d.ts`
      })
    }

    // normalize imports not used as values
    switch (`${compilerOptions.importsNotUsedAsValues}`.toLowerCase()) {
      case 'error':
        compilerOptions.importsNotUsedAsValues = ImportsNotUsedAsValues.Error
        break
      case 'preserve':
        compilerOptions.importsNotUsedAsValues = ImportsNotUsedAsValues.Preserve
        break
      case 'remove':
        compilerOptions.importsNotUsedAsValues = ImportsNotUsedAsValues.Remove
        break
      default:
        break
    }

    // normalize jsx emit
    switch (`${compilerOptions.jsx}`.toLowerCase()) {
      case 'preserve':
        compilerOptions.jsx = JsxEmit.Preserve
        break
      case 'react':
        compilerOptions.jsx = JsxEmit.React
        break
      case 'react-jsx':
        compilerOptions.jsx = JsxEmit.ReactJSX
        break
      case 'react-jsxdev':
        compilerOptions.jsx = JsxEmit.ReactJSXDev
        break
      case 'react-native':
        compilerOptions.jsx = JsxEmit.ReactNative
        break
      default:
        break
    }

    // normalize module
    switch (`${compilerOptions.module}`.toLowerCase()) {
      case 'amd':
        compilerOptions.module = ModuleKind.AMD
        break
      case 'commonjs':
        compilerOptions.module = ModuleKind.CommonJS
        break
      case 'es2015':
        compilerOptions.module = ModuleKind.ES2015
        break
      case 'es2020':
        compilerOptions.module = ModuleKind.ES2020
        break
      case 'es2022':
        compilerOptions.module = ModuleKind.ES2022
        break
      case 'esnext':
        compilerOptions.module = ModuleKind.ESNext
        break
      case 'node16':
        compilerOptions.module = ModuleKind.Node16
        break
      case 'nodenext':
        compilerOptions.module = ModuleKind.NodeNext
        break
      case 'none':
        compilerOptions.module = ModuleKind.None
        break
      case 'system':
        compilerOptions.module = ModuleKind.System
        break
      case 'umd':
        compilerOptions.module = ModuleKind.UMD
        break
      default:
        break
    }

    // normalize module detection
    switch (`${compilerOptions.moduleDetection}`.toLowerCase()) {
      case 'auto':
        compilerOptions.moduleDetection = ModuleDetectionKind.Auto
        break
      case 'force':
        compilerOptions.moduleDetection = ModuleDetectionKind.Force
        break
      case 'legacy':
        compilerOptions.moduleDetection = ModuleDetectionKind.Legacy
        break
      default:
        break
    }

    // normalize module resolution
    switch (`${compilerOptions.moduleResolution}`.toLowerCase()) {
      case 'classic':
        compilerOptions.moduleResolution = ModuleResolutionKind.Classic
        break
      case 'node':
        compilerOptions.moduleResolution = ModuleResolutionKind.NodeJs
        break
      case 'node16':
        compilerOptions.moduleResolution = ModuleResolutionKind.Node16
        break
      case 'nodenext':
        compilerOptions.moduleResolution = ModuleResolutionKind.NodeNext
        break
      default:
        break
    }

    // normalize new line
    switch (`${compilerOptions.newLine}`.toLowerCase()) {
      case 'crlf':
        compilerOptions.newLine = NewLineKind.CarriageReturnLineFeed
        break
      case 'lf':
        compilerOptions.newLine = NewLineKind.LineFeed
        break
      default:
        break
    }

    // normalize target
    switch (`${compilerOptions.target}`.toLowerCase()) {
      case 'es3':
        compilerOptions.target = ScriptTarget.ES3
        break
      case 'es5':
        compilerOptions.target = ScriptTarget.ES5
        break
      case 'es2015':
        compilerOptions.target = ScriptTarget.ES2015
        break
      case 'es2016':
        compilerOptions.target = ScriptTarget.ES2016
        break
      case 'es2017':
        compilerOptions.target = ScriptTarget.ES2017
        break
      case 'es2018':
        compilerOptions.target = ScriptTarget.ES2018
        break
      case 'es2019':
        compilerOptions.target = ScriptTarget.ES2019
        break
      case 'es2020':
        compilerOptions.target = ScriptTarget.ES2020
        break
      case 'es2021':
        compilerOptions.target = ScriptTarget.ES2021
        break
      case 'es2022':
        compilerOptions.target = ScriptTarget.ES2022
        break
      case 'esnext':
        compilerOptions.target = ScriptTarget.ESNext
        break
      default:
        break
    }

    // reset user compiler options
    t.compilerOptions = compilerOptions as CompilerOptionsJson
  }

  return t.compilerOptions as CompilerOptions | CompilerOptionsJson
}

export default getCompilerOptions
