/**
 * @file rollup
 * @module config/rollup
 */

import nodeResolve from '@rollup/plugin-node-resolve'
import type {
  NormalizedOutputOptions,
  OutputBundle,
  PluginContext,
  RollupOptions
} from 'rollup'
import { dts } from 'rollup-plugin-dts'
import pkg from './package.json' with { type: 'json' }

/**
 * The target file.
 *
 * @const {string} file
 */
const file: string = './dist/index.d.mts'

/**
 * The rollup configuration.
 *
 * @see {@linkcode RollupOptions}
 *
 * @type {RollupOptions}
 */
export default {
  external: Object.keys(pkg.dependencies),
  input: file,
  output: [{ file, format: 'esm' }],
  plugins: [
    nodeResolve({ extensions: ['.d.mts', '.mts'] }),
    dts(),
    {
      /**
       * Re-add lost `type` modifiers.
       *
       * The {@linkcode dts} plugin loses `type` modifiers during bundling.
       *
       * @see https://github.com/Swatinem/rollup-plugin-dts/issues/354
       *
       * @this {PluginContext}
       *
       * @param {NormalizedOutputOptions} options
       *  The normalized output options
       * @param {OutputBundle} bundle
       *  The output bundle object
       * @return {undefined}
       */
      generateBundle(
        this: PluginContext,
        options: NormalizedOutputOptions,
        bundle: OutputBundle
      ): undefined {
        for (const output of Object.values(bundle)) {
          if (output.type === 'chunk') {
            output.code = output.code
              .replaceAll('import *', 'import type *')
              .replaceAll('import {', 'import type {')
          }
        }

        return void this
      }
    }
  ]
}
