/**
 * @file Build Config
 * @module config/build
 */

import { defineBuildConfig, type Config } from '@flex-development/mkbuild'
import pkg from './package.json' assert { type: 'json' }

/**
 * Build configuration options.
 *
 * @const {Config} config
 */
const config: Config = defineBuildConfig({
  target: 'node' + pkg.engines.node.replace(/^\D+/, ''),
  treeShaking: true,
  tsconfig: 'tsconfig.build.json'
})

export default config
