/**
 * @file Configuration - Vite
 * @module config/vite
 * @see https://vite.dev/config
 */

import type { UserConfig } from 'vite'
import tsconfig from './tsconfig.json' with { type: 'json' }

/**
 * Vite configuration.
 *
 * @const {UserConfig} config
 */
const config: UserConfig = {
  resolve: {
    conditions: ['browser', ...tsconfig.compilerOptions.customConditions]
  }
}

export default config
