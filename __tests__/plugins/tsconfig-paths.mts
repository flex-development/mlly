/**
 * @file Test Plugins - tsconfigPaths
 * @module tests/plugins/tsconfigPaths
 */

import {
  isRelativeSpecifier,
  resolveAlias,
  type Aliases
} from '@flex-development/mlly'
import pathe from '@flex-development/pathe'
import * as tscu from '@flex-development/tsconfig-utils'
import type { PluginContext } from 'rollup'
import { searchForWorkspaceRoot, type Plugin, type ResolvedConfig } from 'vite'

export default tsconfigPaths

/**
 * Plugin options.
 */
interface Options {
  /**
   * Module id of tsconfig file.
   *
   * @default './tsconfig.json'
   */
  tsconfig?: URL | string | null | undefined
}

/**
 * Create a path alias resolution plugin.
 *
 * @see {@linkcode Options}
 * @see {@linkcode Plugin}
 *
 * @param {URL | string | null | undefined} [options]
 *  Resolved configuration
 * @return {Plugin}
 *  Path alias resolution plugin
 */
function tsconfigPaths(options?: Options | null | undefined): Plugin {
  /**
   * Path aliases.
   *
   * @var {Aliases | null | undefined} aliases
   */
  let aliases: Aliases | null | undefined

  /**
   * URL of root directory.
   *
   * @var {URL | null | undefined} root
   */
  let root: URL | null | undefined

  return {
    configResolved,
    enforce: 'pre',
    name: 'vite-tsconfig-paths',
    resolveId
  }

  /**
   * Load path aliases.
   *
   * @see https://vitejs.dev/guide/api-plugin#configresolved
   *
   * @this {void}
   *
   * @param {ResolvedConfig} config
   *  Resolved configuration
   * @return {undefined}
   */
  function configResolved(config: ResolvedConfig): undefined {
    root = pathe.pathToFileURL(searchForWorkspaceRoot(config.root) + pathe.sep)

    /**
     * URL of tsconfig file.
     *
     * @const {URL} url
     */
    const url: URL = new URL(options?.tsconfig ?? './tsconfig.json', root)

    return void (aliases = tscu.loadPaths(url))
  }

  /**
   * Resolve an aliased `id`.
   *
   * @see https://rollupjs.org/plugin-development/#resolveid
   *
   * @this {PluginContext}
   *
   * @param {string} id
   *  The module specifier to resolve
   * @return {string | null}
   *  URL of resolved `id` or `null`
   */
  function resolveId(this: PluginContext, id: string): string | null {
    if (aliases && root && !isRelativeSpecifier(id) && !pathe.isAbsolute(id)) {
      return resolveAlias(id, { absolute: true, aliases, cwd: root })
    }

    return null
  }
}
