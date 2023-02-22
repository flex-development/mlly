/**
 * @file Configuration - Build
 * @module config/build
 */

import { defineBuildConfig, type Config } from '@flex-development/mkbuild'
import type { BuildResult, PluginBuild } from 'esbuild'
import pkg from './package.json' assert { type: 'json' }

/**
 * Build configuration options.
 *
 * @const {Config} config
 */
const config: Config = defineBuildConfig({
  entries: [
    {
      dts: 'only',
      plugins: [
        {
          name: 'ts-ignore-peers',
          setup({ onEnd }: PluginBuild): void {
            return void onEnd((result: BuildResult<{ write: false }>): void => {
              const { outputFiles } = result

              /**
               * Regular expression used to insert `// @ts-ignore` above
               * property declarations.
               *
               * @const {RegExp} regex
               */
              const regex: RegExp = /\n( +)(.+?\??: )(import\('node-fetch'\).+)/

              /**
               * Property declaration with `// @ts-ignore` prepended.
               *
               * @const {string} replacement
               */
              const replacement: string =
                '\n$1// @ts-ignore peer dependency\n$1$2$3'

              return void (result.outputFiles = outputFiles.map(output => ({
                ...output,
                text: output.text.replace(regex, replacement)
              })))
            })
          }
        }
      ]
    },
    {
      dts: false,
      pattern: ['**/index.ts', 'enums/*', 'internal/*', 'utils/*'],
      sourcemap: true,
      sourcesContent: false
    }
  ],
  target: 'node' + pkg.engines.node.replace(/^\D+/, ''),
  tsconfig: 'tsconfig.build.json'
})

export default config
