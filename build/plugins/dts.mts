/**
 * @file Plugins - dts
 * @module build/plugins/dts
 */

import {
  EXT_DTS_REGEX
} from '@flex-development/ext-regex'
import pathe from '@flex-development/pathe'
import * as tscu from '@flex-development/tsconfig-utils'
import { constant, ksort } from '@flex-development/tutils'
import { ok } from 'devlop'
import type {
  BuildOptions,
  BuildResult,
  OnLoadArgs,
  OnLoadOptions,
  Plugin,
  PluginBuild
} from 'esbuild'
import type {
  CompilerHost,
  CompilerOptions,
  default as TypeScript
} from 'typescript'

export default plugin

/**
 * Plugin configuration options.
 */
type Options = {
  /**
   * Remove declaration source files.
   */
  only?: boolean | null | undefined
}

/**
 * Create a TypeScript declaration plugin.
 *
 * @param {Options | null | undefined} [options]
 *  Plugin configuration options
 * @return {Plugin}
 *  TypeScript declaration plugin
 */
function plugin(options?: Options | null | undefined): Plugin {
  return { name: 'mkbuild:dts', setup }

  /**
   * Generate TypeScript declarations.
   *
   * @param {PluginBuild} build
   *  [esbuild plugin api](https://esbuild.github.io/plugins)
   * @return {undefined}
   */
  function setup(build: PluginBuild): undefined {
    const {
      absWorkingDir = pathe.cwd(),
      bundle,
      outExtension: { '.js': ext } = {}
    } = build.initialOptions

    if (!bundle) {
      /**
       * Absolute paths to source files.
       *
       * @var {string[]} files
       */
      let files: string[] = []

      /**
       * Load options.
       *
       * @const {OnLoadOptions} onLoadOptions
       */
      const onLoadOptions: OnLoadOptions = {
        filter: /\.[cm]?ts$/,
        namespace: 'file'
      }

      build.onLoad(onLoadOptions, (args: OnLoadArgs): undefined => {
        return void files.push(args.path)
      })

      build.onEnd(async (result: BuildResult): Promise<undefined> => {
        files = files.filter(file => !EXT_DTS_REGEX.test(file))

        if (files.length) {
          ok(ext, 'expected `ext`')
          ok(result.outputFiles, 'expected `result.outputFiles`')

          /**
           * TypeScript module.
           *
           * @const {typeof TypeScript} ts
           */
          const ts: typeof TypeScript = (await import('typescript')).default

          /**
           * TypeScript compiler options.
           *
           * @const {CompilerOptions} compilerOptions
           */
          const compilerOptions: CompilerOptions = loadCompilerOptions(
            build.initialOptions
          )

          delete compilerOptions.out

          compilerOptions.declaration = true
          compilerOptions.declarationMap = false
          compilerOptions.emitDeclarationOnly = true
          compilerOptions.noErrorTruncation = true
          compilerOptions.noEmitOnError = false

          /**
           * TypeScript compiler host.
           *
           * @const {CompilerHost} host
           */
          const host: CompilerHost = ts.createCompilerHost(compilerOptions)

          /**
           * Virtual file system for declaration files.
           *
           * @const {Map<string, { path: string; text: string }>} vfs
           */
          const vfs: Map<string, { path: string; text: string }> = new Map()

          /**
           * Write a declaration file to {@linkcode vfs}.
           *
           * @param {string} filename
           *  Name of file to write
           * @param {string} contents
           *  Content to write
           * @return {undefined}
           */
          host.writeFile = function writeFile(
            filename: string,
            contents: string
          ): undefined {
            return void vfs.set(filename.replace(EXT_DTS_REGEX, ext), {
              path: filename,
              text: contents
            })
          }

          // emit declarations to virtual file system
          ts.createProgram(files, compilerOptions, host).emit()

          // add declaration output files
          result.outputFiles = result.outputFiles.flatMap(output => {
            if (vfs.has(output.path)) {
              const { path, text } = vfs.get(output.path)!

              /**
               * Declaration file output.
               *
               * @const {typeof output} dts
               */
              const dts: typeof output = Object.defineProperties({
                contents: new TextEncoder().encode(text),
                hash: '',
                path,
                text: ''
              }, { text: { get: constant(text) } })

              /**
               * Relative path to output file.
               *
               * @const {string} outfile
               */
              const outfile: string = output.path
                .slice(absWorkingDir.length)
                .replace(/^[/\\]/, '')

              // update metafile
              if (result.metafile) {
                /**
                 * Relative path to declaraion output file.
                 *
                 * @const {string} dtsOutfile
                 */
                const dtsOutfile: string = dts.path
                  .slice(absWorkingDir.length)
                  .replace(/^[/\\]/, '')

                result.metafile.outputs[dtsOutfile] = ksort({
                  ...result.metafile.outputs[outfile]!,
                  bytes: Buffer.byteLength(dts.contents)
                })
              }

              // filter output files
              if (options?.only) {
                result.metafile && delete result.metafile.outputs[outfile]
                return [dts]
              }

              return [output, dts]
            }

            return [output]
          })
        }

        return void result
      })
    }

    return void build
  }

  /**
   * Load TypeScript compiler options.
   *
   * @param {BuildOptions} options
   *  [esbuild build api](https://esbuild.github.io/api/#build-api) options
   * @return {CompilerOptions}
   *  Normalized compiler options
   */
  function loadCompilerOptions(options: BuildOptions): CompilerOptions {
    const {
      absWorkingDir = pathe.cwd(),
      outbase = '',
      outdir = pathe.dot,
      preserveSymlinks = false,
      tsconfig = 'tsconfig.json',
      tsconfigRaw
    } = options

    /**
     * TypeScript compiler options.
     *
     * @var {tscu.CompilerOptions | undefined} compilerOptions
     */
    let compilerOptions: tscu.CompilerOptions | undefined

    if (tsconfigRaw) {
      if (typeof tsconfigRaw === 'object' && tsconfigRaw.compilerOptions) {
        compilerOptions = tsconfigRaw.compilerOptions as tscu.CompilerOptions
      }

      if (typeof tsconfigRaw === 'string' && tsconfigRaw) {
        compilerOptions =
          (JSON.parse(tsconfigRaw) as tscu.TSConfig).compilerOptions
      }
    }

    if (!compilerOptions) {
      compilerOptions = tscu.loadCompilerOptions(pathe.resolve(
        absWorkingDir,
        tsconfig
      ))
    }

    compilerOptions.baseUrl = absWorkingDir
    compilerOptions.noEmit = false
    compilerOptions.outDir = pathe.resolve(absWorkingDir, outdir)
    compilerOptions.preserveSymlinks = preserveSymlinks
    compilerOptions.rootDir = pathe.resolve(absWorkingDir, outbase)

    return tscu.normalizeCompilerOptions(compilerOptions)
  }
}
