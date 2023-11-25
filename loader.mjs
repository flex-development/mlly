/**
 * @file Custom Loader Hooks
 * @module loader
 * @see https://nodejs.org/api/esm.html#loaders
 */

import { DECORATOR_REGEX } from '@flex-development/decorator-regex'
import * as esm from '@flex-development/esm-types'
import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'
import * as tutils from '@flex-development/tutils'
import * as esbuild from 'esbuild'
import { URL, fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'
import tsconfig from './tsconfig.json' assert { type: 'json' }

// add support for extensionless files in "bin" scripts
// https://github.com/nodejs/modules/issues/488
mlly.EXTENSION_FORMAT_MAP.set('', mlly.Format.COMMONJS)

/**
 * URL of current working directory.
 *
 * @type {URL}
 * @const cwd
 */
const cwd = pathToFileURL(tsconfig.compilerOptions.baseUrl)

/**
 * Determines how the given module `url` should be interpreted, retrieved, and
 * parsed.
 *
 * @see {@linkcode esm.LoadHookContext}
 * @see {@linkcode esm.LoadHookResult}
 * @see {@linkcode esm.LoadHook}
 * @see {@linkcode esm.ResolvedModuleUrl}
 * @see https://nodejs.org/api/esm.html#loadurl-context-nextload
 *
 * @async
 *
 * @param {esm.ResolvedModuleUrl} url - Resolved module URL
 * @param {esm.LoadHookContext} context - Hook context
 * @return {Promise<esm.LoadHookResult>} Hook result
 */
export const load = async (url, context) => {
  // get module format
  context.format = context.format ?? (await mlly.getFormat(url))

  // validate import assertions
  mlly.validateAssertions(url, context.format, context.importAssertions)

  /**
   * File extension of {@linkcode url}.
   *
   * @type {pathe.Ext | tutils.EmptyString}
   * @const ext
   */
  const ext = pathe.extname(url)

  /**
   * Module source code.
   *
   * @type {tutils.Optional<esm.Source<Uint8Array | string>>}
   * @var source
   */
  let source = await mlly.getSource(url, { format: context.format })

  // emit decorator metadata
  DECORATOR_REGEX.lastIndex = 0
  if (DECORATOR_REGEX.test(source)) {
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { ...tsconfig.compilerOptions, inlineSourceMap: true },
      fileName: url
    })

    source = outputText
  }

  // transform typescript files
  if (/^\.(?:cts|mts|tsx?)$/.test(ext) && !/\.d\.(?:cts|mts|ts)$/.test(url)) {
    // push require condition for .cts files and update format
    if (ext === '.cts') {
      context.conditions = context.conditions ?? []
      context.conditions.unshift('require', 'node')
      context.format = mlly.Format.MODULE
    }

    // resolve path aliases
    source = await mlly.resolveAliases(source, {
      aliases: tsconfig.compilerOptions.paths,
      conditions: context.conditions,
      cwd,
      ext: '',
      parent: url
    })

    // resolve modules
    source = await mlly.resolveModules(source, {
      conditions: context.conditions,
      parent: url
    })

    // transpile source code
    const { code } = await esbuild.transform(source, {
      format: 'esm',
      keepNames: true,
      loader: ext.slice(/^\.[cm]/.test(ext) ? 2 : 1),
      minify: false,
      sourcefile: fileURLToPath(url),
      sourcemap: 'inline',
      target: `node${process.versions.node}`,
      tsconfigRaw: { compilerOptions: tsconfig.compilerOptions }
    })

    // set source code to transpiled source
    source = code
  }

  return {
    format: context.format,
    shortCircuit: true,
    source: tutils.ifelse(context.format === mlly.Format.COMMONJS, null, source)
  }
}

/**
 * Resolves the given module `specifier`, and its module format as a hint to the
 * {@linkcode load} hook.
 *
 * Adds supports for:
 *
 * - Path alias resolution
 * - Extensionless file and directory index resolution
 *
 * @see {@linkcode esm.ResolveHookContext}
 * @see {@linkcode esm.ResolveHookResult}
 * @see {@linkcode esm.ResolveHook}
 * @see https://nodejs.org/api/esm.html#resolvespecifier-context-nextresolve
 *
 * @async
 *
 * @param {string} specifier - Module specifier
 * @param {esm.ResolveHookContext} context - Hook context
 * @return {Promise<esm.ResolveHookResult>} Hook result
 */
export const resolve = async (specifier, context) => {
  const { conditions, parentURL: parent } = context

  // resolve path alias
  specifier = await mlly.resolveAlias(specifier, {
    aliases: tsconfig.compilerOptions.paths,
    conditions,
    cwd,
    parent
  })

  /**
   * Resolved module {@linkcode URL}.
   *
   * @type {URL}
   * @const url
   */
  const url = await mlly.resolveModule(specifier, {
    conditions,
    parent: parent?.startsWith('file:') ? parent : specifier
  })

  return {
    format: await mlly.getFormat(url),
    shortCircuit: true,
    url: url.href
  }
}
