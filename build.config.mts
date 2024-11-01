/**
 * @file Configuration - Build
 * @module config/build
 * @see https://github.com/flex-development/mkbuild
 */

import { defineBuildConfig, type Config } from '@flex-development/mkbuild'
import tsconfig from './tsconfig.build.json' with { type: 'json' }

/**
 * Build config.
 *
 * @type {Config}
 */
export default defineBuildConfig({
  charset: 'utf8',
  entries: [],
  target: ['node18', tsconfig.compilerOptions.target],
  tsconfig: 'tsconfig.build.json'
})
