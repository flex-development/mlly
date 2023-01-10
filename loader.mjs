/**
 * @file Custom Loader
 * @module loader
 * @see https://github.com/TypeStrong/ts-node/issues/1007
 * @see https://nodejs.org/docs/latest-v16.x/api/esm.html#loaders
 */

import pathe from '@flex-development/pathe'
import { createEsmHooks, register } from 'ts-node'
import { createMatchPath, loadConfig } from 'tsconfig-paths'

/**
 * @type {import('ts-node').NodeLoaderHooksAPI2}
 * @const hooks - `ts-node` loader hooks
 */
const hooks = createEsmHooks(register())

/**
 * Determines how `url` should be interpreted, retrieved, and parsed.
 *
 * @see {@linkcode LoadHookContext}
 * @see https://nodejs.org/docs/latest-v16.x/api/esm.html#loadurl-context-nextload
 *
 * @async
 *
 * @param {string} url - Module URL
 * @param {LoadHookContext} context - Hook context
 * @param {LoadHook} nextLoad - Subsequent `load` hook in the chain or default
 * Node.js `load` hook after last user-supplied `load` hook
 * @return {Promise<LoadHookResult>} Hook result
 */
export const load = async (url, context, nextLoad) => {
  // support for extensionless files in "bin" scripts
  // https://github.com/nodejs/modules/issues/488#issuecomment-804895142
  if (/^file:\/{3}.*\/bin\//.test(url) && !pathe.extname(url)) {
    context.format = 'commonjs'
  }

  return hooks.load(url, context, nextLoad)
}

/**
 * Resolves a file URL for a given module specifier and parent URL, and
 * optionally its format (such as `'module'`) as a hint to {@linkcode load}.
 *
 * **Note**: Path aliases found in tsconfig(s) are respected during resolution.
 *
 * @see {@linkcode ResolveHookContext}
 * @see https://nodejs.org/docs/latest-v16.x/api/esm.html#resolvespecifier-context-nextresolve
 *
 * @async
 *
 * @param {string} specifier - Module specifier
 * @param {ResolveHookContext} context - Hook context
 * @param {ResolveHook} nextResolve - Subsequent `resolve` hook in the chain
 * or default Node.js `resolve` hook after last user-supplied `resolve` hook
 * @return {Promise<ResolveHookResult>} Hook result
 * @throws {Error}
 */
export const resolve = async (specifier, context, nextResolve) => {
  /**
   * @type {import('tsconfig-paths').ConfigLoaderResult}
   * @const result - `tsconfig-paths` config loader result
   */
  const result = loadConfig(pathe.resolve('.'))

  if (result.resultType === 'failed') throw new Error(result.message)

  specifier =
    createMatchPath(
      result.absoluteBaseUrl,
      result.paths,
      result.mainFields,
      result.addMatchAll
    )(specifier, undefined, undefined, [
      '.cjs',
      '.cts',
      '.js',
      '.json',
      '.jsx',
      '.mdx',
      '.mjs',
      '.mts',
      '.ts',
      '.tsx'
    ]) ?? specifier

  return hooks.resolve(specifier, context, nextResolve)
}
