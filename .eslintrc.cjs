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
  extends: ['./.eslintrc.base.cjs'],
  overrides: [
    ...require('./.eslintrc.base.cjs').overrides,
    {
      extends: ['plugin:vue/vue3-recommended'],
      files: '**/*.vue',
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: require('./package.json').type
      },
      rules: {
        'unicorn/filename-case': [
          2,
          {
            cases: { pascalCase: true },
            ignore: []
          }
        ],
        'vue/max-attributes-per-line': 0,
        'vue/multi-word-component-names': 0
      }
    },
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
      files: [
        'src/interfaces/options-get-format.ts',
        'src/interfaces/options-get-source.ts'
      ],
      rules: {
        '@typescript-eslint/prefer-ts-expect-error': 0
      }
    },
    {
      files: ['src/utils/find-exports.ts'],
      rules: {
        'unicorn/prefer-module': 0
      }
    },
    {
      files: ['src/utils/parse-data-url.ts', 'src/utils/parse-module-id.ts'],
      rules: {
        'unicorn/no-unreadable-array-destructuring': 0
      }
    }
  ],
  root: true
}

module.exports = config
