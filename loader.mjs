/**
 * @file Custom Loader
 * @module loader
 * @see https://nodejs.org/docs/latest-v16.x/api/esm.html#loaders
 */

import * as mlly from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import * as esbuild from 'esbuild'
import { fileURLToPath, pathToFileURL } from 'node:url'
import tsconfig from './tsconfig.json' assert { type: 'json' }

// add support for extensionless files in "bin" scripts
// https://github.com/nodejs/modules/issues/488
mlly.EXTENSION_FORMAT_MAP.set('', mlly.Format.COMMONJS)

/**
 * Determines how `url` should be interpreted, retrieved, and parsed.
 *
 * @see {@linkcode LoadHookContext}
 * @see https://nodejs.org/docs/latest-v16.x/api/esm.html#loadurl-context-nextload
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
   * @const {ReturnType<typeof pathe['extname']>} ext
   */
  const ext = pathe.extname(url)

  /**
   * Source code.
   *
   * @var {Uint8Array | string | undefined} source
   */
  let source = await mlly.getSource(url, { format: context.format })

  // transform typescript files
  if (/^\.(?:cts|mts|tsx?)$/.test(ext) && !/\.d\.(?:cts|mts|ts)$/.test(url)) {
    // resolve path aliases
    source = await mlly.resolveAliases(source, {
      aliases: tsconfig.compilerOptions.paths,
      conditions: context.conditions,
      cwd: pathToFileURL(tsconfig.compilerOptions.baseUrl),
      parent: url
    })

    // resolve modules
    source = await mlly.resolveModules(source, {
      conditions: context.conditions,
      parent: url
    })

    // transpile source code
    const { code } = await esbuild.transform(source, {
      format: ext === '.cts' ? 'cjs' : 'esm',
      loader: /^[cm]/.test(ext) ? 'ts' : ext.slice(1),
      minify: false,
      sourcefile: fileURLToPath(url),
      sourcemap: 'inline',
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
 * @see https://nodejs.org/docs/latest-v16.x/api/esm.html#resolvespecifier-context-nextresolve
 *
 * @async
 *
 * @param {string} specifier - Module specifier
 * @param {ResolveHookContext} context - Hook context
 * @return {Promise<ResolveHookResult>} Hook result
 * @throws {Error}
 */
export const resolve = async (specifier, context) => {
  const { conditions, parentURL: parent } = context

  // resolve path alias
  specifier = await mlly.resolveAlias(specifier, {
    aliases: tsconfig.compilerOptions.paths,
    conditions,
    cwd: pathToFileURL(tsconfig.compilerOptions.baseUrl),
    parent
  })

  /**
   * Resolved module URL.
   *
   * @const {URL} url
   */
  const url = await mlly.resolveModule(specifier, { conditions, parent })

  return {
    format: await mlly.getFormat(url),
    shortCircuit: true,
    url: url.href
  }
}
