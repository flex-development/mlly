/**
 * @file make
 * @module build/make
 */

import cleaner from '#build/plugins/clean'
import declarations from '#build/plugins/dts'
import writer from '#build/plugins/write'
import {
  ERR_MODULE_NOT_FOUND,
  type ErrModuleNotFound
} from '@flex-development/errnode'
import type { OutputExtension, OutputMetadata } from '@flex-development/mkbuild'
import { defaultExtensions, readPackageJson } from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import type { PackageJson } from '@flex-development/pkg-types'
import {
  defaults,
  shake,
  sift,
  template
} from '@flex-development/tutils'
import consola from 'consola'
import {
  context,
  type BuildContext,
  type BuildOptions,
  type BuildResult,
  type Loader,
  type LogLevel,
  type ServeOptions
} from 'esbuild'
import pb from 'pretty-bytes'
import color from 'tinyrainbow'

export { make as default, type Options }

/**
 * Options used by `mkbuild`.
 */
type SpecificOptions = { metafile: true; write: false }

/**
 * Build context.
 *
 * @see {@linkcode BuildContext}
 */
type Context = BuildContext<SpecificOptions>

/**
 * Configuration options.
 *
 * @see {@linkcode Task}
 *
 * @extends {Task}
 */
interface Options extends Task {
  /**
   * Build entries.
   *
   * > **Note**: If empty, `null`, or `undefined`, a single build entry will be
   * > inferred from the remaining set of configuration options.
   */
  entries?: Partial<Omit<Task, 'write'>>[] | null | undefined

  /**
   * Serve files.
   *
   * @see {@linkcode ServeOptions}
   * @see https://esbuild.github.io/api/#serve
   */
  serve?: ServeOptions | boolean | undefined

  /**
   * Watch files.
   */
  watch?: boolean | undefined
}

/**
 * Build task.
 *
 * @see {@linkcode BuildOptions}
 *
 * @extends {Omit<BuildOptions,'metafile'>}
 */
interface Task extends Omit<BuildOptions, 'metafile'> {
  /**
   * Remove output directory before starting build.
   */
  clean?: boolean | undefined

  /**
   * Generate TypeScript declaration (`*.d.cts`, `*.d.mts`, or `*.d.ts`) files.
   *
   * Pass `'only'` to only write declaration files.
   */
  dts?: boolean | 'only' | undefined

  /**
   * Output file extension.
   *
   * @see {@linkcode OutputExtension}
   *
   * @default
   *  format === 'cjs' ? '.cjs' : format === 'esm' ? '.mjs' : '.js'
   */
  ext?: OutputExtension | undefined

  /**
   * Bundle output file name.
   *
   * @default '[name]'
   */
  name?: string | undefined

  /**
   * Name of directory containing source files or path to bundle input.
   *
   * @default
   *  bundle ? 'src/index' : 'src'
   */
  source?: string | undefined
}

/**
 * Build result.
 *
 * @see {@linkcode BuildResult}
 * @see {@linkcode SpecificOptions}
 *
 * @extends {BuildResult<SpecificOptions>}
 */
interface Result extends BuildResult<SpecificOptions> {
  /**
   * Output directtory.
   */
  outdir: string
}

/**
 * [esbuild][1] based file-to-file transformer and bundler.
 *
 * [esbuild]: https://esbuild.github.io
 *
 * @see {@linkcode ErrModuleNotFound}
 * @see {@linkcode Options}
 * @see {@linkcode Result}
 *
 * @async
 *
 * @param {Options | null | undefined} [options]
 *  Build configuration options
 * @return {Promise<Result[]>}
 *  Build results
 * @throws {ErrModuleNotFound}
 */
async function make(
  this: void,
  options?: Options | null | undefined
): Promise<Result[]> {
  if (!options) options = {}

  const { entries, serve, watch, ...opts } = defaults(options, {
    absWorkingDir: '.',
    bundle: false,
    logLevel: <LogLevel>'info',
    outdir: 'dist',
    serve: <ServeOptions | boolean>false,
    watch: false,
    write: false
  })

  /**
   * Absolute path to working directory.
   *
   * @const {string} absWorkingDir
   */
  const absWorkingDir: string = pathe.resolve(opts.absWorkingDir)

  /**
   * Package manifest.
   *
   * @const {PackageJson | null} pkg
   */
  const pkg: PackageJson | null = readPackageJson(
    pathe.pathToFileURL(absWorkingDir + pathe.sep)
  )

  if (!pkg) {
    throw new ERR_MODULE_NOT_FOUND(
      pathe.join(absWorkingDir, 'package.json'),
      pathe.fileURLToPath(import.meta.url),
      'module'
    )
  } else {
    consola.info(color.cyan(startMessage(pkg.name, { ...opts, serve, watch })))
  }

  /**
   * Static build?
   *
   * @const {boolean} staticBuild
   */
  const staticBuild: boolean = !serve && !watch

  /**
   * Build results.
   *
   * @const {Result[]} results
   */
  const results: Result[] = []

  for (const task of entries ?? [opts]) {
    const {
      assetNames = 'assets/[name]-[hash]',
      banner = {},
      bundle = false,
      chunkNames = 'chunks/[name]-[hash]',
      clean = true,
      color = true,
      conditions = ['import', 'default'],
      drop,
      dts = Object.keys({
        ...pkg.dependencies,
        ...pkg.devDependencies
      }).includes('typescript'),
      external = [],
      footer = {},
      format = 'esm',
      inject,
      loader = {},
      logLimit = 10,
      logOverride = {},
      mainFields = ['module', 'main'],
      name = '[name]',
      outExtension = {},
      outdir = opts.outdir,
      pure,
      platform = 'neutral',
      plugins = [],
      resolveExtensions = defaultExtensions,
      source = bundle ? 'src/index' : 'src',
      target,
      tsconfig,
      write = false,
      ext = format === 'cjs' ? '.cjs' : format === 'esm' ? '.mjs' : '.js',
      outbase = bundle ? pathe.dirname(source) : source,
      ...options
    } = { ...opts, ...task, absWorkingDir }

    /**
     * Build context.
     *
     * @const {Context} ctx
     */
    const ctx: Context = await context(shake({
      ...options,
      absWorkingDir,
      allowOverwrite: false,
      assetNames,
      banner,
      bundle,
      chunkNames,
      color,
      conditions: [...new Set(conditions)],
      drop: [...new Set(drop)],
      entryNames: `[dir]${pathe.sep}${name}`,
      external: bundle
        ? [
          ...new Set([
            ...Object.keys({ ...pkg.peerDependencies }),
            ...external
          ])
        ]
        : [],
      footer,
      format,
      inject: [...new Set(inject)],
      loader: <Record<string, Loader>>{
        '.cjs': format === 'cjs' && !bundle ? 'copy' : 'js',
        '.css': bundle ? 'css' : 'copy',
        '.cts': 'ts',
        '.d.cts': 'copy',
        '.d.mts': 'copy',
        '.d.ts': 'copy',
        '.data': bundle ? 'binary' : 'copy',
        '.eot': 'copy',
        '.gif': 'copy',
        '.jpeg': 'copy',
        '.jpg': 'copy',
        '.js': 'js',
        '.json': bundle ? 'json' : 'copy',
        '.json5': bundle ? 'json' : 'copy',
        '.jsonc': bundle ? 'json' : 'copy',
        '.jsx': 'jsx',
        '.mjs': format === 'esm' && !bundle ? 'copy' : 'js',
        '.mts': 'ts',
        '.otf': 'copy',
        '.png': 'copy',
        '.svg': 'copy',
        '.ts': 'ts',
        '.tsx': 'tsx',
        '.txt': bundle ? 'text' : 'copy',
        '.woff': 'copy',
        '.woff2': 'copy',
        ...loader
      },
      logLimit,
      logOverride,
      mainFields: [...new Set(mainFields)],
      metafile: true as const,
      outExtension: { ...outExtension, '.js': ext },
      outbase,
      outdir,
      platform,
      plugins: sift([
        clean && cleaner(),
        dts && declarations({ only: dts === 'only' }),
        ...plugins,
        write && writer()
      ]),
      pure: [...new Set(pure)],
      resolveExtensions: [...new Set(resolveExtensions)],
      target: Array.isArray(target) ? [...new Set(target)] : target,
      tsconfig,
      write: false as const
    }))

    results.push({ ...await ctx.rebuild(), outdir })
    await ctx.dispose()
  }

  /**
   * Build analysis.
   *
   * @var {string} buildAnalysis
   */
  let buildAnalysis: string = ''

  /**
   * Total build size (in bytes).
   *
   * @var {number} buildSize
   */
  let buildSize: number = 0

  for (const { outdir, metafile } of results) {
    const { analysis, bytes } = analyzeOutputs(outdir, metafile.outputs)
    buildSize += bytes
    buildAnalysis += analysis + '\n'
  }

  if (staticBuild) {
    consola.success(color.green(`Build succeeded for ${pkg.name}`))
    buildAnalysis && consola.log(buildAnalysis.trimEnd())
    consola.log('Σ Total build size:', color.cyan(pb(buildSize)))
  }

  return results
}

/**
 * Generate a build analysis for the given `outputs`.
 *
 * @see {@linkcode OutputMetadata}
 *
 * @param {string} outdir
 *  Output directory name
 * @param {Record<string, Pick<OutputMetadata, 'bytes'>>} [outputs={}]
 *  Build output map from metafile
 * @return {{ analysis: string; bytes: number }}
 *  Build output analysis and size
 */
function analyzeOutputs(
  outdir: string,
  outputs: Record<string, Pick<OutputMetadata, 'bytes'>> = {}
): { analysis: string; bytes: number } {
  /**
   * Indentation.
   *
   * @const {string} indent
   */
  const indent: string = ' '.repeat(2)

  /**
   * Output strings.
   *
   * @const {string[]} lines
   */
  const lines: string[] = []

  /**
   * Total output size.
   *
   * @const {number} size
   */
  const size: number = Object.entries(outputs).reduce((acc, output) => {
    const [outfile, metadata] = output
    lines.push(color.gray(`${indent}└─ ${outfile} (${pb(metadata.bytes)})`))
    return acc + metadata.bytes
  }, 0)

  return {
    analysis: template(`${indent}{0} (total size: {1})\n{2}`, {
      0: color.bold(outdir),
      1: color.cyan(pb(size)),
      2: lines.join('\n')
    }),
    bytes: size
  }
}

/**
 * Create a start message.
 *
 * @internal
 *
 * @param {string | null | undefined} name
 *  Package name
 * @param {Options | null | undefined} [options]
 *  Configuration options
 * @return {string}
 *  Start message
 */
function startMessage(
  name: string | null | undefined,
  options?: Options | null | undefined
): string {
  /**
   * Start message prefix.
   *
   * @const {string} startPrefix
   */
  const startPrefix: string = options?.serve
    ? 'Serving'
    : options?.watch
    ? 'Watching'
    : 'Building'

  return `${startPrefix} ${name}`
}
