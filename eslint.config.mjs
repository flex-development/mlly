/**
 * @file eslint
 * @module config/eslint
 * @see https://eslint.org/docs/user-guide/configuring
 */

import fldv from '@flex-development/eslint-config'

/**
 * eslint configuration.
 *
 * @type {import('eslint').Linter.Config[]}
 * @const config
 */
const config = [
  ...fldv.configs.node,
  {
    files: [
      '__fixtures__/**/dist/*.+(cjs|js|mjs)',
      '__fixtures__/node_modules/**/*.+(cjs|js|mjs)'
    ],
    rules: {
      'jsdoc/require-file-overview': 0,
      'unicorn/no-empty-file': 0
    }
  },
  {
    files: [
      'src/interfaces/__tests__/buffer-encoding-map.spec-d.mts',
      'src/interfaces/buffer-encoding-map.mts'
    ],
    rules: {
      'unicorn/text-encoding-identifier-case': 0
    }
  },
  {
    files: ['src/internal/__tests__/is-promise.spec.mts'],
    rules: {
      'unicorn/no-thenable': 0
    }
  },
  {
    files: [
      'src/internal/chain-or-call.mts',
      'src/lib/get-source.mts',
      'src/lib/is-directory.mts',
      'src/lib/is-file.mts',
      'src/lib/lookup-package-scope.mts',
      'src/lib/read-package-json.mts',
      'src/lib/resolve-module.mts',
      'src/lib/resolver.mts'
    ],
    rules: {
      'promise/prefer-await-to-then': 0
    }
  }
]

export default config
