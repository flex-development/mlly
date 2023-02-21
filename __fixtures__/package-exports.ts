/**
 * @file Fixtures - PACKAGE_EXPORTS
 * @module fixtures/PACKAGE_EXPORTS
 */

import type { Nullable } from '@flex-development/tutils'

export default {
  '.': './dist/index.mjs',
  './internal': null,
  './internal/*': null,
  './package.json': './package.json',
  './utils': './dist/utils/index.mjs',
  './utils/*': './dist/utils/*.mjs'
} as Record<`.${string}`, Nullable<string>>
