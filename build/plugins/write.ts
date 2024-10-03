/**
 * @file Plugins - write
 * @module build/plugins/write
 */

import { fs } from '@flex-development/mkbuild'
import pathe from '@flex-development/pathe'
import { ok } from 'devlop'
import type { BuildResult, Plugin, PluginBuild } from 'esbuild'

/**
 * Create an output file writer plugin.
 *
 * @return {Plugin}
 *  Output file writer plugin
 */
function plugin(): Plugin {
  return { name: 'mkbuild:write', setup }

  /**
   * Write output files.
   *
   * @param {PluginBuild} build
   *  [esbuild plugin api](https://esbuild.github.io/plugins)
   * @param {PluginBuild['onEnd']} build.onEnd
   *  Build end callback
   * @return {undefined}
   */
  function setup(build: PluginBuild): undefined {
    return void build.onEnd(async (result: BuildResult): Promise<undefined> => {
      ok(result.outputFiles, 'expected `result.outputFiles`')

      for (const output of result.outputFiles) {
        await fs.mkdir(pathe.dirname(output.path), { recursive: true })
        await fs.writeFile(output.path, output.text, 'utf8')
      }

      return void result
    })
  }
}

export default plugin
