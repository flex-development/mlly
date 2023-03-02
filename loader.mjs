/**
 * @file Custom Loader Hooks
 * @module loader
 * @see https://nodejs.org/api/esm.html#loaders
 */

import * as mlly from '@flex-development/mlly'
import * as pathe from '@flex-development/pathe'
import * as tutils from '@flex-development/tutils'
import * as esbuild from 'esbuild'
import { fileURLToPath, pathToFileURL } from 'node:url'
import tsconfig from './tsconfig.json' assert { type: 'json' }

// add support for extensionless files in "bin" scripts
// https://github.com/nodejs/modules/issues/488
mlly.EXTENSION_FORMAT_MAP.set('', mlly.Format.COMMONJS)

/**
 * URL of current working directory.
 *
 * @type {import('node:url').URL}
 * @const cwd
 */
const cwd = pathToFileURL(tsconfig.compilerOptions.baseUrl)

/**
 * Determines how the module at the given `url` should be interpreted,
 * retrieved, and parsed.
 *
 * @see {@linkcode LoadHookContext}
 * @see https://nodejs.org/api/esm.html#loadurl-context-nextload
 *
 * @async
 *
 * @param {string} url - Resolved module URL
 * @param {LoadHookContext} context - Hook context
 * @return {Promise<LoadHookResult>} Hook result
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
   * Source code.
   *
   * @type {Uint8Array | string | undefined}
   * @var source
   */
  let source = await mlly.getSource(url, { format: context.format })

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

  return { format: context.format, shortCircuit: true, source }
}

/**
 * Resolves the given module `specifier`.
 *
 * Adds supports for:
 *
 * - Path alias resolution
 * - Extensionless file and directory index resolution
 *
 * @see {@linkcode ResolveHookContext}
 * @see https://nodejs.org/api/esm.html#resolvespecifier-context-nextresolve
 *
 * @async
 *
 * @param {string} specifier - Module specifier
 * @param {ResolveHookContext} context - Hook context
 * @return {Promise<ResolveHookResult>} Hook result
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
   * Resolved module URL.
   *
   * @type {import('node:url').URL}
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
