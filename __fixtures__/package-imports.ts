/**
 * @file Fixtures - PACKAGE_IMPORTS
 * @module fixtures/PACKAGE_IMPORTS
 */

import type { ImportsKey } from '@flex-development/pkg-types'

export default {
  '#mkbuild': '@flex-development/mkbuild',
  '#src': './src/index.ts',
  '#src/*': './src/*.ts'
} as Record<ImportsKey, string>
