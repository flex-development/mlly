/**
 * @file Plugins - dts
 * @module build/plugins/dts
 */

import {
  EXT_DTS_REGEX,
  EXT_JS_REGEX,
  EXT_TS_REGEX
} from '@flex-development/ext-regex'
import pathe from '@flex-development/pathe'
import * as tscu from '@flex-development/tsconfig-utils'
import { defaults, shake } from '@flex-development/tutils'
import { ok } from 'devlop'
import type { BuildResult, Plugin, PluginBuild } from 'esbuild'
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
   * @param {BuildOptions} build.initialOptions
   *  [esbuild build api](https://esbuild.github.io/api/#build-api) options
   * @param {PluginBuild['onEnd']} build.onEnd
   *  Build end callback
   * @param {PluginBuild['onResolve']} build.onResolve
   *  Path resolution callback
   * @return {void}
   */
  async function setup(build: PluginBuild): Promise<void> {
    const {
      absWorkingDir,
      bundle,
      color = true,
      format,
      outExtension: { '.js': ext = '.js' } = {},
      outbase = '',
      outdir = '.',
      preserveSymlinks,
      tsconfig = 'tsconfig.json'
    } = build.initialOptions

    if (!bundle) {
      /**
       * TypeScript module.
       *
       * @const {typeof TypeScript} ts
       */
      const ts: typeof TypeScript = (await import('typescript')).default

      build.onEnd((result: BuildResult): undefined => {
        ok(absWorkingDir, 'expected `absWorkingDir`')
        ok(result.metafile, 'expected `result.metafile`')
        ok(result.outputFiles, 'expected `result.outputFiles`')

        /**
         * Absolute paths to source files.
         *
         * @const {string[]} files
         */
        const files: string[] = Object
          .keys(result.metafile.inputs)
          .map(key => pathe.join(absWorkingDir, key))
          .filter(file => !EXT_DTS_REGEX.test(file))

        if (files.length) {
          /**
           * Path to tsconfig file.
           *
           * @const {string} tsconfigPath
           */
          const tsconfigPath: string = pathe.resolve(absWorkingDir, tsconfig)

          /**
           * TypeScript compiler options.
           *
           * @var {CompilerOptions | tscu.CompilerOptions} compilerOptions
           */
          let compilerOptions: CompilerOptions | tscu.CompilerOptions

          compilerOptions = tscu.loadCompilerOptions(tsconfigPath)

          delete compilerOptions.declarationDir
          delete compilerOptions.out
          delete compilerOptions.outFile
          delete compilerOptions.rootDirs
          delete compilerOptions.sourceMap
          delete compilerOptions.sourceRoot

          compilerOptions.declaration = true
          compilerOptions.declarationMap = false
          compilerOptions.emitDeclarationOnly = true
          compilerOptions.noEmit = false
          compilerOptions.noErrorTruncation = true
          compilerOptions.noEmitOnError = false
          compilerOptions.outDir = pathe.resolve(absWorkingDir, outdir)
          compilerOptions.rootDir = pathe.resolve(absWorkingDir, outbase)

          compilerOptions = tscu.normalizeCompilerOptions(compilerOptions)

          compilerOptions = defaults(compilerOptions, shake({
            allowJs: true,
            allowUmdGlobalAccess: format === 'iife',
            allowUnreachableCode: false,
            baseUrl: absWorkingDir,
            checkJs: false,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            isolatedModules: true,
            module: ts.ModuleKind.ESNext,
            moduleResolution: tscu.normalizeModuleResolution(
              tscu.ModuleResolutionKind.NodeJs
            ),
            noImplicitAny: true,
            noImplicitOverride: true,
            noImplicitReturns: true,
            preserveConstEnums: true,
            preserveSymlinks,
            pretty: color,
            resolveJsonModule: true,
            skipLibCheck: true,
            target: ts.ScriptTarget.ESNext
          }))

          /**
           * TypeScript compiler host.
           *
           * @const {CompilerHost} host
           */
          const host: CompilerHost = ts.createCompilerHost(compilerOptions)

          /**
           * Virtual file system for declaration files.
           *
           * @const {Record<string, { contents: string, path: string }>} vfs
           */
          const vfs: Record<string, string> = {}

          // first letter before "js" or "ts" in output file extension
          const [, cm = ''] = /\.(c|m)?[jt]sx?$/.exec(ext)!

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
            filename = filename.replace(EXT_DTS_REGEX, `.d.${cm}ts`)
            return void (vfs[filename] = contents)
          }

          // emit declarations to virtual file system
          ts.createProgram(files, compilerOptions, host).emit()

          // insert declaration files
          result.outputFiles = result.outputFiles.flatMap(output => {
            /**
             * Absolute path to declaration file for {@linkcode output}.
             *
             * @const {string} dtsPath
             */
            const dtsPath: string = EXT_JS_REGEX.test(output.path)
              ? output.path.replace(EXT_JS_REGEX, '.d.$1ts')
              : EXT_TS_REGEX.test(output.path) &&
                  !EXT_DTS_REGEX.test(output.path)
              ? output.path.replace(EXT_TS_REGEX, '.d.$2ts')
              : ''

            if (dtsPath in vfs) {
              /**
               * Relative path to declaration output file.
               *
               * @const {string} dtsOutfile
               */
              const dtsOutfile: string = dtsPath
                .slice(absWorkingDir.length)
                .replace(/^[/\\]/, '')

              /**
               * Relative path to output file.
               *
               * @const {string} outfile
               */
              const outfile: string = output.path
                .slice(absWorkingDir.length)
                .replace(/^[/\\]/, '')

              /**
               * Declaration output file text.
               *
               * @const {string} text
               */
              const text: string = vfs[dtsPath]!

              /**
               * Declaration output file contents.
               *
               * @const {Uint8Array} contents
               */
              const contents: Uint8Array = new TextEncoder().encode(text)

              /**
               * Declaration file output.
               *
               * @const {typeof output} dts
               */
              const dts: typeof output = Object.defineProperties({
                contents,
                hash: '',
                path: dtsPath,
                text: ''
              }, {
                text: { get: () => text }
              })

              // update metafile
              result.metafile!.outputs[dtsOutfile] = {
                ...result.metafile!.outputs[outfile]!,
                bytes: Buffer.byteLength(contents)
              }

              // filter output files
              if (options?.only) {
                delete result.metafile!.outputs[outfile]
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
}
