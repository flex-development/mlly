/**
 * @file Configuration - Build
 * @module config/build
 * @see https://github.com/flex-development/mkbuild
 */

import { defineBuildConfig, type Config } from '@flex-development/mkbuild'
import type { BuildResult, PluginBuild } from 'esbuild'
import pkg from './package.json' assert { type: 'json' }
import tsconfig from './tsconfig.build.json' assert { type: 'json' }

/**
 * Build configuration options.
 *
 * @const {Config} config
 */
const config: Config = defineBuildConfig({
  charset: 'utf8',
  entries: [
    { dts: 'only' },
    {
      dts: false,
      pattern: ['**/index.ts', 'enums/*', 'internal/*', 'utils/*'],
      sourcemap: true,
      sourcesContent: true
    }
  ],
  plugins: [
    {
      name: 'ts-ignore-peers',

      /**
       * Inserts `// @ts-ignore peer dependency` above property declarations
       * using types from peer dependencies.
       *
       * [1]: https://esbuild.github.io/plugins
       *
       * @see https://github.com/microsoft/TypeScript/issues/38628#issuecomment-1439749496
       *
       * @param {PluginBuild} build - [esbuild plugin api][1]
       * @param {PluginBuild['onEnd']} build.onEnd - Build end callback
       * @return {void} Nothing when complete
       */
      setup({ onEnd }: PluginBuild): void {
        return void onEnd((result: BuildResult<{ write: false }>): void => {
          const { outputFiles } = result

          /**
           * Regular expression used to insert `// @ts-ignore` above
           * property declarations.
           *
           * @see https://regex101.com/r/6r7Cke
           *
           * @const {RegExp} regex
           */
          const regex: RegExp =
            /\n( +)(.+?\??: )(\w+<)?(import\('node-fetch'\).+)/g

          /**
           * Property declaration with `// @ts-ignore` prepended.
           *
           * @const {string} replacement
           */
          const replacement: string =
            '\n$1// @ts-ignore peer dependency\n$1$2$3$4'

          return void (result.outputFiles = outputFiles.map(output => {
            return output.path.endsWith('.d.mts')
              ? {
                  ...output,
                  text: output.text.replace(regex, replacement)
                }
              : output
          }))
        })
      }
    }
  ],
  target: [
    pkg.engines.node.replace(/^\D+/, 'node'),
    tsconfig.compilerOptions.target
  ],
  tsconfig: 'tsconfig.build.json'
})

export default config
