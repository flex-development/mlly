/**
 * @file Plugins - clean
 * @module build/plugins/clean
 */

import { fs } from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import { ok } from 'devlop'
import type { Plugin, PluginBuild } from 'esbuild'

/**
 * Cleaned directory cache.
 *
 * @internal
 *
 * @const {Set<string>} cache
 */
const cache: Set<string> = new Set<string>()

/**
 * Create an output directory cleaner plugin.
 *
 * @return {Plugin}
 *  Output directory cleaner plugin
 */
function plugin(): Plugin {
  return { name: 'mkbuild:clean', setup }

  /**
   * Clean an output directory.
   *
   * Cleaning will skipped if a cache hit is found in {@linkcode cache}.
   *
   * @async
   *
   * @param {PluginBuild} build
   *  [esbuild plugin api](https://esbuild.github.io/plugins)
   * @param {BuildOptions} build.initialOptions
   *  [esbuild build api](https://esbuild.github.io/api/#build-api) options
   * @return {Promise<undefined>}
   */
  async function setup(build: PluginBuild): Promise<undefined> {
    const {
      absWorkingDir = process.cwd(),
      outdir = 'dist'
    } = build.initialOptions

    // prevent working directory from being removed
    ok(absWorkingDir, 'expected `absWorkingDir`')
    cache.add(pathe.resolve(absWorkingDir))

    /**
     * Absolute path to output directory.
     *
     * @const {string} path
     */
    const path: string = pathe.resolve(absWorkingDir, outdir)

    // clean output directory if cache hit was not found for `path`
    if (!cache.has(path)) {
      // 1. unlink output directory
      // 2. try removing output directory
      // 3. recreate output directory
      await fs.unlink(path).catch(() => ({}))
      await fs.rm(path, { recursive: true }).catch(() => ({}))
      await fs.mkdir(path, { recursive: true })
    }

    return void cache.add(path)
  }
}

export default plugin
