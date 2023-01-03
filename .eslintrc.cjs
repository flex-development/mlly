/**
 * @file ESLint Configuration - Root
 * @module config/eslint
 * @see https://eslint.org/docs/user-guide/configuring
 */

/**
 * @type {import('eslint').Linter.Config}
 * @const config - ESLint configuration object
 */
const config = {
  root: true,
  extends: ['./.eslintrc.base.cjs'],
  overrides: [
    ...require('./.eslintrc.base.cjs').overrides,
    {
      files: ['docs/.vitepress/components/Doc.vue'],
      rules: {
        'vue/no-v-html': 0
      }
    },
    {
      files: ['docs/.vitepress/config.ts'],
      rules: {
        'unicorn/string-content': 0
      }
    },
    {
      files: ['src/internal/__tests__/get-compiler-options.spec.ts'],
      rules: {
        'unicorn/no-keyword-prefix': 0
      }
    },
    {
      files: ['src/utils/find-exports.ts'],
      rules: {
        'unicorn/prefer-module': 0
      }
    }
  ]
}

module.exports = config
