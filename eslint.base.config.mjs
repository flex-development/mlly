/**
 * @file ESLint Configuration - Base
 * @module config/eslint/base
 * @see https://eslint.org/docs/user-guide/configuring
 */

import eslint from '@eslint/js'
import globals from 'globals'
import fs from 'node:fs'
import ts from 'typescript-eslint'
import pkg from './package.json' with { type: 'json' }

/**
 * @typedef {import('eslint').ESLint.Plugin} Plugin
 * @typedef {import('eslint').Linter.Config} Config
 * @typedef {import('eslint').Linter.Parser} Parser
 * @typedef {import('eslint').Linter.SourceType} SourceType
 */

/**
 * Load a plugin.
 *
 * @async
 *
 * @param {string} name
 *  Plugin module name
 * @return {Promise<Plugin>}
 *  Eslint plugin
 */
const plugin = async name => (await import(name)).default

/**
 * Eslint configuration objects.
 *
 * @type {Config[]}
 */
export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
          jsx: true
        }
      },
      sourceType: /** @type {SourceType} */ (pkg.type)
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.cts', '.mts', '.ts', '.tsx']
      },
      'import/resolver': {
        node: true,
        typescript: true
      },
      jsdoc: {
        augmentsExtendsReplacesDocs: true,
        ignoreInternal: false,
        ignorePrivate: false,
        implementsReplacesDocs: true,
        mode: 'typescript',
        overrideReplacesDocs: true,
        preferredTypes: {
          '*': false,
          '.<>': false,
          'Array<>': { replacement: '[]' },
          Object: { replacement: 'object' },
          'Object<>': { replacement: 'Record<>' },
          object: 'object'
        },
        structuredTags: {
          category: {
            name: 'namepath-referencing',
            required: ['name'],
            type: false
          },
          const: {
            name: 'namepath-defining',
            required: ['name']
          },
          decorator: {
            name: 'none'
          },
          enum: {
            name: 'namepath-defining',
            required: ['name', 'type']
          },
          experimental: {
            name: false,
            type: false
          },
          extends: {
            name: 'namepath-defining',
            required: ['type']
          },
          fires: {
            required: ['name']
          },
          implements: {
            name: 'namepath-defining',
            required: ['type']
          },
          maximum: {
            name: 'text',
            required: ['name']
          },
          member: {
            name: 'namepath-defining',
            required: ['name', 'type']
          },
          minimum: {
            name: 'text',
            required: ['name']
          },
          next: {
            name: 'namepath-defining',
            required: ['type']
          },
          packageManager: {
            name: 'text',
            required: ['name']
          },
          param: {
            name: 'namepath-defining',
            required: ['name', 'type']
          },
          return: {
            name: 'namepath-defining',
            required: ['type']
          },
          throws: {
            name: 'namepath-defining',
            required: ['type']
          },
          type: {
            name: 'namepath-defining',
            required: ['type']
          },
          var: {
            name: 'namepath-defining',
            required: ['name']
          },
          visibleName: {
            required: ['name']
          },
          yield: {
            name: 'namepath-defining',
            required: ['type']
          }
        },
        tagNamePreference: {
          augments: 'extends',
          constant: 'const',
          fileoverview: 'file',
          member: 'member',
          returns: 'return',
          var: 'var',
          yields: 'yield'
        }
      }
    }
  },
  {
    files: ['**/*.+(cjs|cts|js|jsx|mjs|mts|ts|tsx)'],
    languageOptions: {
      globals: {
        ...globals.es2024,
        ...globals.node,
        Chai: 'readonly',
        Console: 'readonly',
        NodeJS: 'readonly',
        React: fs.existsSync('node_modules/react') ? 'readonly' : false
      },
      parser: /** @type {Parser} */ (ts.parser),
      parserOptions: {
        extraFileExtensions: [],
        program: null,
        project: null,
        tsconfigRootDir: import.meta.dirname,
        warnOnUnsupportedTypeScriptVersion: true
      }
    },
    plugins: {
      '@stylistic': await plugin('@stylistic/eslint-plugin'),
      '@typescript-eslint': /** @type {Plugin} */ (ts.plugin),
      import: await plugin('eslint-plugin-import'),
      jsdoc: await plugin('eslint-plugin-jsdoc'),
      node: await plugin('eslint-plugin-n'),
      promise: await plugin('eslint-plugin-promise'),
      unicorn: await plugin('eslint-plugin-unicorn')
    },
    rules: {
      '@stylistic/lines-between-class-members': [
        2,
        'always',
        {
          exceptAfterOverload: true,
          exceptAfterSingleLine: false
        }
      ],
      '@stylistic/quotes': [
        2,
        'single',
        {
          allowTemplateLiterals: true,
          avoidEscape: true
        }
      ],
      '@typescript-eslint/adjacent-overload-signatures': 2,
      '@typescript-eslint/array-type': [
        2,
        {
          default: 'array',
          readonly: 'array'
        }
      ],
      '@typescript-eslint/ban-ts-comment': [
        2,
        {
          minimumDescriptionLength: 3,
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description'
        }
      ],
      '@typescript-eslint/ban-tslint-comment': 2,
      '@typescript-eslint/class-literal-property-style': [2, 'getters'],
      '@typescript-eslint/class-methods-use-this': 0,
      '@typescript-eslint/consistent-generic-constructors': [
        2,
        'type-annotation'
      ],
      '@typescript-eslint/consistent-indexed-object-style': 0,
      '@typescript-eslint/consistent-type-assertions': 0,
      '@typescript-eslint/consistent-type-definitions': 0,
      '@typescript-eslint/consistent-type-imports': 0,
      '@typescript-eslint/default-param-last': 2,
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/init-declarations': 0,
      '@typescript-eslint/max-params': 0,
      '@typescript-eslint/member-ordering': [
        2,
        {
          default: {
            memberTypes: [
              'static-field',
              'instance-field',
              'signature',
              'call-signature',
              'public-constructor',
              'protected-constructor',
              'private-constructor',
              'static-initialization',
              'static-get',
              'static-set',
              'static-method',
              ['instance-get', 'instance-set'],
              'instance-method'
            ],
            order: 'alphabetically'
          }
        }
      ],
      '@typescript-eslint/method-signature-style': [2, 'method'],
      '@typescript-eslint/no-confusing-non-null-assertion': 0,
      '@typescript-eslint/no-dupe-class-members': 2,
      '@typescript-eslint/no-dynamic-delete': 0,
      '@typescript-eslint/no-empty-function': [
        2,
        {
          allow: ['constructors', 'decoratedFunctions']
        }
      ],
      '@typescript-eslint/no-empty-object-type': [
        2,
        {
          allowInterfaces: 'always'
        }
      ],
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-extra-non-null-assertion': 2,
      '@typescript-eslint/no-extraneous-class': [
        2,
        {
          allowConstructorOnly: false,
          allowEmpty: true,
          allowStaticOnly: true,
          allowWithDecorator: true
        }
      ],
      '@typescript-eslint/no-import-type-side-effects': 0,
      '@typescript-eslint/no-inferrable-types': 0,
      '@typescript-eslint/no-invalid-this': [2, { capIsConstructor: true }],
      '@typescript-eslint/no-invalid-void-type': [
        2,
        {
          allowAsThisParameter: true,
          allowInGenericTypeArguments: true
        }
      ],
      '@typescript-eslint/no-loop-func': 2,
      '@typescript-eslint/no-loss-of-precision': 2,
      '@typescript-eslint/no-magic-numbers': 0,
      '@typescript-eslint/no-misused-new': 2,
      '@typescript-eslint/no-namespace': 0,
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 2,
      '@typescript-eslint/no-non-null-asserted-optional-chain': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/no-redeclare': 0,
      '@typescript-eslint/no-require-imports': 2,
      '@typescript-eslint/no-restricted-imports': 0,
      '@typescript-eslint/no-shadow': 0,
      '@typescript-eslint/no-this-alias': [
        2,
        {
          allowDestructuring: false,
          allowedNames: ['self']
        }
      ],
      '@typescript-eslint/no-unnecessary-type-constraint': 2,
      '@typescript-eslint/no-unsafe-declaration-merging': 2,
      // '@typescript-eslint/no-unsafe-function-type': 2,
      '@typescript-eslint/no-unused-expressions': [
        2,
        {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true,
          enforceForJSX: true
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          args: 'after-used',
          caughtErrors: 'all',
          ignoreRestSiblings: false,
          vars: 'all'
        }
      ],
      '@typescript-eslint/no-use-before-define': [
        2,
        {
          allowNamedExports: true,
          classes: true,
          enums: true,
          functions: false,
          ignoreTypeReferences: true,
          typedefs: true,
          variables: true
        }
      ],
      '@typescript-eslint/no-useless-constructor': 2,
      '@typescript-eslint/no-useless-empty-export': 2,
      // '@typescript-eslint/no-wrapper-object-types': 2,
      '@typescript-eslint/parameter-properties': 0,
      '@typescript-eslint/prefer-as-const': 2,
      '@typescript-eslint/prefer-enum-initializers': 0,
      '@typescript-eslint/prefer-for-of': 2,
      '@typescript-eslint/prefer-function-type': 0,
      '@typescript-eslint/prefer-literal-enum-member': [
        2,
        {
          allowBitwiseExpressions: true
        }
      ],
      '@typescript-eslint/prefer-namespace-keyword': 2,
      '@typescript-eslint/triple-slash-reference': [
        2,
        {
          lib: 'never',
          path: 'never',
          types: 'prefer-import'
        }
      ],
      '@typescript-eslint/typedef': 0,
      '@typescript-eslint/unified-signatures': 2,
      'class-methods-use-this': 0,
      'default-param-last': 0,
      eqeqeq: 1,
      'import/no-duplicates': [
        2,
        {
          considerQueryString: true,
          'prefer-inline': true
        }
      ],
      'init-declarations': 0,
      'jsdoc/check-access': 1,
      'jsdoc/check-alignment': 1,
      'jsdoc/check-examples': 0,
      // https://github.com/gajus/eslint-plugin-jsdoc/issues/541
      'jsdoc/check-indentation': 0,
      'jsdoc/check-line-alignment': [
        1,
        'never',
        {
          customSpacings: {
            postDelimiter: 1,
            postHyphen: 1,
            postName: 1,
            postTag: 1,
            postType: 1
          },
          tags: [
            'param',
            'property',
            'return',
            'template',
            'throws',
            'typeParam'
          ],
          wrapIndent: ' '
        }
      ],
      'jsdoc/check-param-names': [
        1,
        {
          allowExtraTrailingParamDocs: false,
          checkDestructured: true,
          checkRestProperty: true,
          disableExtraPropertyReporting: true,
          enableFixer: true
        }
      ],
      'jsdoc/check-property-names': [1, { enableFixer: true }],
      'jsdoc/check-syntax': 1,
      'jsdoc/check-tag-names': [
        1,
        {
          definedTags: [
            'decorator',
            'experimental',
            'maximum',
            'minimum',
            'next',
            'packageManager',
            'visibleName'
          ],
          jsxTags: false
        }
      ],
      'jsdoc/check-types': [1, { unifyParentAndChildTypeChecks: true }],
      'jsdoc/check-values': 1,
      'jsdoc/empty-tags': 1,
      'jsdoc/implements-on-classes': 1,
      'jsdoc/match-description': 0,
      'jsdoc/match-name': 0,
      'jsdoc/multiline-blocks': 1,
      'jsdoc/no-bad-blocks': [1, { preventAllMultiAsteriskBlocks: true }],
      'jsdoc/no-defaults': 0,
      'jsdoc/no-missing-syntax': 0,
      'jsdoc/no-multi-asterisks': [
        1,
        {
          allowWhitespace: true,
          preventAtEnd: true,
          preventAtMiddleLines: true
        }
      ],
      'jsdoc/no-restricted-syntax': 0,
      'jsdoc/no-types': 0,
      'jsdoc/no-undefined-types': [1, {
        definedTypes: ['never', 'unknown'],
        // https://github.com/gajus/eslint-plugin-jsdoc/issues/1119
        // this rule would be nice to use to check property name changes, but
        // it does not work properly. reporting is disabled for now, but in
        // the future, some eslint-plugin-jsdoc usage may need to be replaced
        // with a docast-based plugin.
        disableReporting: true,
        markVariablesAsUsed: true
      }],
      'jsdoc/require-asterisk-prefix': [1, 'always'],
      'jsdoc/require-description': [
        1,
        {
          checkConstructors: true,
          checkGetters: true,
          checkSetters: true,
          contexts: [
            'ClassDeclaration',
            'MethodDefinition',
            'PropertyDefinition',
            'TSInterfaceDeclaration',
            'TSMethodSignature',
            'VariableDeclaration'
          ],
          descriptionStyle: 'body'
        }
      ],
      'jsdoc/require-description-complete-sentence': 0,
      'jsdoc/require-example': 0,
      'jsdoc/require-file-overview': [
        1,
        {
          tags: {
            file: {
              initialCommentsOnly: true,
              mustExist: true,
              preventDuplicates: true
            },
            module: {
              initialCommentsOnly: true,
              mustExist: true,
              preventDuplicates: true
            }
          }
        }
      ],
      'jsdoc/require-hyphen-before-param-description': 0,
      'jsdoc/require-jsdoc': [
        1,
        {
          checkConstructors: true,
          checkGetters: true,
          checkSetters: true,
          contexts: [
            'PropertyDefinition',
            'TSDeclareFunction:not(TSDeclareFunction + TSDeclareFunction)',
            'TSMethodSignature',
            'FunctionDeclaration:not(TSDeclareFunction + FunctionDeclaration)'
          ],
          enableFixer: true,
          exemptEmptyConstructors: false,
          exemptEmptyFunctions: false,
          require: {
            ArrowFunctionExpression: false,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true
          }
        }
      ],
      'jsdoc/require-param': [
        1,
        {
          autoIncrementBase: 0,
          checkConstructors: true,
          checkDestructured: true,
          checkDestructuredRoots: true,
          checkGetters: true,
          checkRestProperty: true,
          checkSetters: true,
          enableFixer: true,
          enableRestElementFixer: true,
          enableRootFixer: true,
          exemptedBy: ['inheritdoc', 'this'],
          unnamedRootBase: ['param'],
          useDefaultObjectProperties: true
        }
      ],
      'jsdoc/require-param-description': 1,
      'jsdoc/require-param-name': 1,
      'jsdoc/require-param-type': 1,
      'jsdoc/require-property': 1,
      'jsdoc/require-property-description': 1,
      'jsdoc/require-property-name': 1,
      'jsdoc/require-property-type': 1,
      'jsdoc/require-returns': [
        1,
        {
          checkConstructors: false,
          checkGetters: true,
          forceRequireReturn: true,
          forceReturnsWithAsync: true
        }
      ],
      'jsdoc/require-returns-check': [
        1,
        {
          exemptAsync: false,
          exemptGenerators: true,
          reportMissingReturnForUndefinedTypes: true
        }
      ],
      'jsdoc/require-returns-description': 1,
      'jsdoc/require-returns-type': 1,
      'jsdoc/require-throws': 1,
      'jsdoc/require-yields': [
        1,
        {
          forceRequireNext: true,
          forceRequireYields: true,
          next: true,
          nextWithGeneratorTag: true,
          withGeneratorTag: true
        }
      ],
      'jsdoc/require-yields-check': [
        1,
        {
          checkGeneratorsOnly: true,
          next: true
        }
      ],
      'jsdoc/sort-tags': 0,
      'jsdoc/tag-lines': [
        1,
        'any',
        {
          applyToEndTag: true,
          count: 1,
          endLines: 0,
          startLines: 1,
          tags: {}
        }
      ],
      'jsdoc/valid-types': [1, { allowEmptyNamepaths: true }],
      'lines-between-class-members': 0,
      'max-params': 0,
      'no-array-constructor': 0,
      'no-case-declarations': 0,
      'no-constant-condition': 2,
      'no-dupe-class-members': 0,
      'no-duplicate-imports': 0,
      'no-empty': [2, { allowEmptyCatch: true }],
      'no-empty-function': 0,
      'no-ex-assign': 0,
      'no-extra-parens': 0,
      'no-extra-semi': 0,
      'no-invalid-this': 0,
      'no-loop-func': 0,
      'no-loss-of-precision': 0,
      'no-magic-numbers': 0,
      'no-redeclare': 0,
      'no-restricted-imports': 0,
      'no-return-await': 0,
      'no-shadow': 0,
      'no-sparse-arrays': 0,
      'no-throw-literal': 0,
      'no-unused-expressions': 0,
      'no-unused-vars': 0,
      'no-use-before-define': 0,
      'no-useless-constructor': 0,
      'no-warning-comments': 0,
      'node/callback-return': [2, ['callback', 'cb', 'done', 'next']],
      'node/exports-style': [2, 'module.exports', { allowBatchAssign: true }],
      'node/file-extension-in-import': 0,
      'node/global-require': 0,
      'node/handle-callback-err': [2, '^(err|error)$'],
      'node/no-callback-literal': 2,
      'node/no-deprecated-api': 2,
      'node/no-exports-assign': 2,
      'node/no-extraneous-import': 0,
      'node/no-extraneous-require': 0,
      'node/no-missing-import': 0,
      'node/no-new-require': 2,
      'node/no-path-concat': 2,
      'node/no-process-env': 0,
      'node/no-process-exit': 0,
      'node/no-unpublished-bin': 0,
      'node/no-unpublished-import': 0,
      'node/no-unpublished-require': 0,
      'node/no-unsupported-features/es-builtins': 2,
      'node/no-unsupported-features/es-syntax': 0,
      'node/no-unsupported-features/node-builtins': [
        2,
        {
          allowExperimental: true
        }
      ],
      'node/prefer-global/buffer': 2,
      'node/prefer-global/console': 2,
      'node/prefer-global/process': 2,
      'node/prefer-global/text-decoder': 2,
      'node/prefer-global/text-encoder': 2,
      'node/prefer-global/url': 0,
      'node/prefer-global/url-search-params': 2,
      'node/prefer-promises/dns': 2,
      'node/prefer-promises/fs': 2,
      'node/process-exit-as-throw': 2,
      'node/shebang': 0,
      'padding-line-between-statements': 0,
      'prefer-arrow-callback': 0,
      'promise/always-return': 2,
      'promise/avoid-new': 0,
      'promise/catch-or-return': [2, { allowFinally: true, allowThen: true }],
      'promise/no-callback-in-promise': 2,
      'promise/no-native': 0,
      'promise/no-nesting': 2,
      'promise/no-new-statics': 2,
      'promise/no-promise-in-callback': 2,
      'promise/no-return-in-finally': 2,
      'promise/no-return-wrap': [2, { allowReject: false }],
      'promise/param-names': 2,
      'promise/prefer-await-to-callbacks': 1,
      'promise/prefer-await-to-then': 2,
      'promise/valid-params': 2,
      quotes: 0,
      'sort-keys': [
        2,
        'asc',
        {
          caseSensitive: true,
          minKeys: 2,
          natural: true
        }
      ],
      'unicorn/better-regex': [2, { sortCharacterClasses: true }],
      'unicorn/catch-error-name': [2, { name: 'e' }],
      'unicorn/consistent-destructuring': 2,
      'unicorn/custom-error-definition': 2,
      'unicorn/empty-brace-spaces': 2,
      'unicorn/error-message': 2,
      'unicorn/escape-case': 2,
      'unicorn/expiring-todo-comments': [
        2,
        {
          allowWarningComments: true,
          ignore: [],
          ignoreDatesOnPullRequests: true,
          terms: ['@fixme', '@todo']
        }
      ],
      'unicorn/explicit-length-check': 0,
      'unicorn/filename-case': [
        2,
        {
          cases: { kebabCase: true },
          ignore: []
        }
      ],
      'unicorn/import-index': 2,
      'unicorn/import-style': [2, { styles: {} }],
      'unicorn/new-for-builtins': 2,
      'unicorn/no-abusive-eslint-disable': 2,
      'unicorn/no-array-callback-reference': 0,
      'unicorn/no-array-for-each': 2,
      'unicorn/no-array-method-this-argument': 2,
      'unicorn/no-array-push-push': 0,
      'unicorn/no-array-reduce': 0,
      'unicorn/no-await-expression-member': 0,
      'unicorn/no-console-spaces': 2,
      'unicorn/no-empty-file': 2,
      'unicorn/no-for-loop': 0,
      'unicorn/no-hex-escape': 2,
      'unicorn/no-instanceof-array': 2,
      'unicorn/no-keyword-prefix': [
        2,
        {
          checkProperties: false,
          disallowedPrefixes: ['class', 'new'],
          onlyCamelCase: true
        }
      ],
      'unicorn/no-lonely-if': 0,
      'unicorn/no-nested-ternary': 0,
      'unicorn/no-new-array': 2,
      'unicorn/no-new-buffer': 2,
      'unicorn/no-null': 0,
      'unicorn/no-object-as-default-parameter': 2,
      'unicorn/no-process-exit': 2,
      'unicorn/no-static-only-class': 0,
      'unicorn/no-thenable': 2,
      'unicorn/no-this-assignment': 2,
      'unicorn/no-unreadable-array-destructuring': 0,
      'unicorn/no-unsafe-regex': 0,
      'unicorn/no-unused-properties': 2,
      'unicorn/no-useless-fallback-in-spread': 2,
      'unicorn/no-useless-length-check': 2,
      'unicorn/no-useless-promise-resolve-reject': 2,
      'unicorn/no-useless-spread': 2,
      'unicorn/no-useless-undefined': 0,
      'unicorn/no-zero-fractions': 2,
      'unicorn/number-literal-case': 0,
      // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2003
      'unicorn/numeric-separators-style': 0,
      'unicorn/prefer-add-event-listener': 2,
      'unicorn/prefer-array-find': 2,
      'unicorn/prefer-array-flat': [2, { functions: [] }],
      'unicorn/prefer-array-flat-map': 2,
      'unicorn/prefer-array-index-of': 2,
      'unicorn/prefer-array-some': 2,
      'unicorn/prefer-at': 0,
      'unicorn/prefer-code-point': 2,
      'unicorn/prefer-date-now': 2,
      'unicorn/prefer-default-parameters': 2,
      'unicorn/prefer-export-from': [2, { ignoreUsedVariables: true }],
      'unicorn/prefer-includes': 2,
      'unicorn/prefer-json-parse-buffer': 0,
      'unicorn/prefer-math-trunc': 0,
      'unicorn/prefer-module': 2,
      'unicorn/prefer-negative-index': 2,
      'unicorn/prefer-node-protocol': 2,
      'unicorn/prefer-number-properties': 2,
      'unicorn/prefer-object-from-entries': [2, { functions: [] }],
      'unicorn/prefer-optional-catch-binding': 2,
      'unicorn/prefer-prototype-methods': 2,
      'unicorn/prefer-reflect-apply': 2,
      'unicorn/prefer-regexp-test': 0,
      'unicorn/prefer-set-has': 2,
      'unicorn/prefer-spread': 2,
      'unicorn/prefer-string-replace-all': 0,
      'unicorn/prefer-string-slice': 2,
      'unicorn/prefer-string-starts-ends-with': 2,
      'unicorn/prefer-string-trim-start-end': 2,
      'unicorn/prefer-switch': 2,
      'unicorn/prefer-ternary': 2,
      'unicorn/prefer-top-level-await': 0,
      'unicorn/prefer-type-error': 2,
      'unicorn/prevent-abbreviations': 0,
      'unicorn/relative-url-style': [2, 'never'],
      'unicorn/require-array-join-separator': 2,
      'unicorn/require-number-to-fixed-digits-argument': 2,
      'unicorn/string-content': [2, { patterns: {} }],
      'unicorn/template-indent': [2, { indent: 2 }],
      'unicorn/text-encoding-identifier-case': 2,
      'unicorn/throw-new-error': 2
    }
  },
  {
    files: ['**/*.+(cts|mts|ts|tsx)'],
    ignores: ['**/*.{md,mdx}/*.+(cts|mts|ts|tsx)'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.typecheck.json'],
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/await-thenable': 2,
      '@typescript-eslint/consistent-return': 0,
      '@typescript-eslint/consistent-type-exports': [
        2,
        {
          fixMixedExportsWithInlineTypeSpecifier: true
        }
      ],
      '@typescript-eslint/dot-notation': [
        2,
        {
          allowIndexSignaturePropertyAccess: false,
          allowKeywords: true,
          allowPattern: undefined,
          allowPrivateClassPropertyAccess: false,
          allowProtectedClassPropertyAccess: false
        }
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        2,
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public'
          }
        }
      ],
      '@typescript-eslint/explicit-module-boundary-types': [
        2,
        {
          allowArgumentsExplicitlyTypedAsAny: true,
          allowDirectConstAssertionInArrowFunctions: true,
          allowHigherOrderFunctions: false,
          allowTypedFunctionExpressions: false,
          allowedNames: []
        }
      ],
      '@typescript-eslint/naming-convention': 0,
      '@typescript-eslint/no-array-delete': 0,
      '@typescript-eslint/no-base-to-string': [
        2,
        {
          ignoredTypeNames: [
            'Error',
            'RegExp',
            'SemVer',
            'URL',
            'URLSearchParams'
          ]
        }
      ],
      '@typescript-eslint/no-confusing-void-expression': [
        2,
        {
          ignoreArrowShorthand: true,
          ignoreVoidOperator: true
        }
      ],
      '@typescript-eslint/no-duplicate-type-constituents': 0,
      '@typescript-eslint/no-floating-promises': [
        2,
        {
          ignoreIIFE: false,
          ignoreVoid: true
        }
      ],
      '@typescript-eslint/no-for-in-array': 2,
      '@typescript-eslint/no-implied-eval': 2,
      '@typescript-eslint/no-meaningless-void-operator': 0,
      '@typescript-eslint/no-misused-promises': [
        2,
        {
          checksConditionals: true,
          checksVoidReturn: true
        }
      ],
      '@typescript-eslint/no-mixed-enums': 0,
      '@typescript-eslint/no-redundant-type-constituents': 2,
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': [
        2,
        {
          allowComparingNullableBooleansToFalse: true,
          allowComparingNullableBooleansToTrue: true
        }
      ],
      '@typescript-eslint/no-unnecessary-condition': [
        2,
        {
          allowConstantLoopConditions: true,
          allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false
        }
      ],
      '@typescript-eslint/no-unnecessary-qualifier': 2,
      '@typescript-eslint/no-unnecessary-template-expression': 0,
      '@typescript-eslint/no-unnecessary-type-arguments': 2,
      '@typescript-eslint/no-unnecessary-type-assertion': [
        2,
        {
          typesToIgnore: []
        }
      ],
      '@typescript-eslint/no-unnecessary-type-constraint': 2,
      '@typescript-eslint/no-unsafe-argument': 2,
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/no-unsafe-call': 2,
      '@typescript-eslint/no-unsafe-enum-comparison': 0,
      '@typescript-eslint/no-unsafe-member-access': 2,
      '@typescript-eslint/no-unsafe-return': 2,
      '@typescript-eslint/no-unsafe-unary-minus': 0,
      '@typescript-eslint/non-nullable-type-assertion-style': 2,
      '@typescript-eslint/only-throw-error': 2,
      '@typescript-eslint/prefer-destructuring': 0,
      '@typescript-eslint/prefer-find': 0,
      '@typescript-eslint/prefer-includes': 0,
      '@typescript-eslint/prefer-nullish-coalescing': [
        2,
        {
          ignoreConditionalTests: true,
          ignoreMixedLogicalExpressions: true,
          ignorePrimitives: { boolean: true, string: true }
        }
      ],
      '@typescript-eslint/prefer-optional-chain': 2,
      '@typescript-eslint/prefer-promise-reject-errors': 2,
      '@typescript-eslint/prefer-readonly': 2,
      '@typescript-eslint/prefer-readonly-parameter-types': 0,
      '@typescript-eslint/prefer-reduce-type-parameter': 2,
      '@typescript-eslint/prefer-regexp-exec': 2,
      '@typescript-eslint/prefer-return-this-type': 0,
      '@typescript-eslint/prefer-string-starts-ends-with': [
        2,
        {
          allowSingleElementEquality: 'always'
        }
      ],
      '@typescript-eslint/promise-function-async': 2,
      '@typescript-eslint/require-array-sort-compare': 2,
      '@typescript-eslint/require-await': 2,
      '@typescript-eslint/restrict-plus-operands': [
        2,
        {
          allowAny: false,
          allowBoolean: false,
          allowNullish: false,
          allowNumberAndString: true,
          allowRegExp: false,
          skipCompoundAssignments: true
        }
      ],
      '@typescript-eslint/restrict-template-expressions': [
        2,
        {
          allowAny: false,
          allowBoolean: true,
          allowNullish: true,
          allowNumber: true,
          allowRegExp: true
        }
      ],
      '@typescript-eslint/return-await': [2, 'in-try-catch'],
      '@typescript-eslint/strict-boolean-expressions': 0,
      '@typescript-eslint/switch-exhaustiveness-check': 2,
      '@typescript-eslint/unbound-method': [2, { ignoreStatic: true }],
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 2,
      'consistent-return': 0,
      'dot-notation': 0,
      'no-implied-eval': 0,
      'prefer-destructuring': 0,
      'prefer-promise-reject-errors': 0,
      'require-await': 0
    }
  },
  {
    files: ['**/*.+(cjs|cts)'],
    rules: {
      '@typescript-eslint/no-require-imports': 0,
      'unicorn/prefer-module': 0
    }
  },
  {
    files: ['**/*.+(cts|mts)'],
    rules: {
      '@typescript-eslint/consistent-type-assertions': [
        2,
        {
          assertionStyle: 'as'
        }
      ]
    }
  },
  {
    files: ['**/*.d.+(cts|mts|ts)'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 0,
      'jsdoc/no-undefined-types': 0,
      'jsdoc/require-file-overview': 0,
      'no-undef': 0,
      'no-var': 0,
      'unicorn/filename-case': 0,
      'unicorn/no-keyword-prefix': 0
    }
  },
  {
    files: ['**/*.abstract.+(mts|ts)'],
    rules: {
      '@typescript-eslint/no-useless-constructor': 0
    }
  },
  {
    files: [
      '**/*.interface.+(mts|ts)',
      '**/interfaces/*.+(mts|ts)',
      '**/types/*.+(mts|ts)'
    ],
    rules: {
      '@typescript-eslint/no-invalid-void-type': 0
    }
  },
  {
    files: [
      '**/__mocks__/**/*.+(mts|ts|tsx)',
      '**/__tests__/*.spec.+(mts|ts|tsx)',
      '**/__tests__/*.spec-d.+(mts|ts)',
      '**/__tests__/setup/*.+(mts|ts|tsx)',
      '**/__tests__/utils/*.+(mts|ts|tsx)'
    ],
    languageOptions: {
      globals: {
        afterAll: true,
        afterEach: true,
        assert: true,
        beforeAll: true,
        beforeEach: true,
        chai: true,
        describe: true,
        expect: true,
        faker: fs.existsSync('node_modules/@faker-js/faker'),
        it: true,
        pf: fs.existsSync('node_modules/pretty-format'),
        server: fs.existsSync('node_modules/msw'),
        suite: true,
        test: true,
        vi: true,
        vitest: true
      }
    },
    plugins: {
      'chai-expect': await plugin('eslint-plugin-chai-expect'),
      'jest-formatting': await plugin('eslint-plugin-jest-formatting')
    },
    rules: {
      '@typescript-eslint/class-literal-property-style': 0,
      '@typescript-eslint/no-base-to-string': 0,
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/no-invalid-void-type': 0,
      '@typescript-eslint/no-unused-expressions': 0,
      '@typescript-eslint/prefer-as-const': 0,
      '@typescript-eslint/prefer-ts-expect-error': 0,
      '@typescript-eslint/require-await': 0,
      '@typescript-eslint/restrict-template-expressions': 0,
      '@typescript-eslint/unbound-method': 0,
      'chai-expect/missing-assertion': 2,
      'chai-expect/no-inner-compare': 2,
      'chai-expect/no-inner-literal': 2,
      'chai-expect/terminating-properties': [2, { properties: [] }],
      'jest-formatting/padding-around-after-all-blocks': 1,
      'jest-formatting/padding-around-after-each-blocks': 1,
      'jest-formatting/padding-around-before-all-blocks': 1,
      'jest-formatting/padding-around-before-each-blocks': 1,
      'jest-formatting/padding-around-describe-blocks': 1,
      'jest-formatting/padding-around-expect-groups': 1,
      'jest-formatting/padding-around-test-blocks': 1,
      'jsdoc/require-jsdoc': 0,
      'no-control-regex': 0,
      'no-empty-pattern': 0,
      'promise/prefer-await-to-callbacks': 0,
      'promise/valid-params': 0,
      'unicorn/consistent-destructuring': 0,
      'unicorn/error-message': 0,
      'unicorn/no-array-for-each': 0,
      'unicorn/no-hex-escape': 0,
      'unicorn/no-useless-undefined': 0,
      'unicorn/prefer-at': 0,
      'unicorn/prefer-dom-node-append': 0,
      'unicorn/string-content': 0
    }
  },
  {
    files: ['**/__tests__/*.spec-d.+(mts|ts)'],
    languageOptions: {
      globals: {
        assertType: true,
        expectTypeOf: true
      }
    },
    rules: {
      '@typescript-eslint/no-redundant-type-constituents': 0
      // '@typescript-eslint/no-unsafe-function-type': 0,
      // '@typescript-eslint/no-wrapper-object-types': 0
    }
  },
  {
    files: ['**/cli/**/*.+(mts|ts)'],
    rules: {
      'node/prefer-global/process': [2, 'never'],
      'unicorn/no-process-exit': 0
    }
  },
  {
    files: [
      '**/enums/*.+(mts|ts)',
      '**/interfaces/*.+(mts|ts)',
      '**/types/*.+(mts|ts)'
    ],
    rules: {
      'unicorn/no-keyword-prefix': 0
    }
  },
  {
    files: ['**/*.+(json|json5|jsonc)'],
    ignores: [
      '**/__tests__/benchmark.json',
      '**/__tests__/report.*',
      '**/__tests__/typecheck.json',
      '**/tsconfig*temp.json'
    ],
    languageOptions: {
      parser: await import('jsonc-eslint-parser')
    },
    plugins: {
      jsonc: /** @type {any} */ ((await import('eslint-plugin-jsonc')).default)
    },
    rules: {
      'jsonc/no-bigint-literals': 2,
      'jsonc/no-binary-expression': 2,
      'jsonc/no-binary-numeric-literals': 2,
      'jsonc/no-escape-sequence-in-identifier': 2,
      'jsonc/no-hexadecimal-numeric-literals': 2,
      'jsonc/no-infinity': 2,
      'jsonc/no-multi-str': 2,
      'jsonc/no-nan': 2,
      'jsonc/no-number-props': 2,
      'jsonc/no-numeric-separators': 2,
      'jsonc/no-octal': 0,
      'jsonc/no-octal-escape': 2,
      'jsonc/no-octal-numeric-literals': 2,
      'jsonc/no-parenthesized': 2,
      'jsonc/no-plus-sign': 2,
      'jsonc/no-regexp-literals': 2,
      'jsonc/no-sparse-arrays': 2,
      'jsonc/no-template-literals': 2,
      'jsonc/no-undefined-value': 2,
      'jsonc/no-unicode-codepoint-escapes': 2,
      'jsonc/no-useless-escape': 2,
      'jsonc/sort-array-values': [
        2,
        {
          order: { caseSensitive: true, type: 'asc' },
          pathPattern: '^$'
        }
      ],
      'jsonc/sort-keys': [
        2,
        {
          order: { caseSensitive: true, type: 'asc' },
          pathPattern: '^$'
        }
      ],
      'jsonc/valid-json-number': 2,
      'jsonc/vue-custom-block/no-parsing-error': 2
    }
  },
  {
    files: ['**/*.+(json5|jsonc)', 'tsconfig*.json'],
    rules: {
      'jsonc/no-comments': 0
    }
  },
  {
    files: ['**/*.{md,mdx}'],
    languageOptions: {
      globals: {
        React: false
      },
      parser: (await import('eslint-mdx')).parser
    },
    plugins: {
      mdx: await plugin('eslint-plugin-mdx')
    },
    processor: 'mdx/remark',
    rules: {
      'mdx/remark': 1,
      'no-unused-expressions': 2,
      'react/react-in-jsx-scope': 0
    },
    settings: {
      'mdx/code-blocks': true
    }
  },
  {
    files: ['**/*.{md,mdx}/*.+(cjs|cts|js|jsx|mdx|mjs|mts|ts|tsx)'],
    languageOptions: {
      parserOptions: {
        program: null,
        project: false
      }
    },
    rules: {
      'jsdoc/require-file-overview': 0,
      strict: 0,
      'unicorn/filename-case': 0
    }
  },
  {
    files: ['**/package.json'],
    rules: {
      'jsonc/sort-keys': [
        2,
        {
          order: [
            'name',
            'description',
            'version',
            'keywords',
            'license',
            'homepage',
            'repository',
            'bugs',
            'author',
            'contributors',
            'publishConfig',
            'type',
            'files',
            'exports',
            'main',
            'module',
            'types',
            'scripts',
            'dependencies',
            'devDependencies',
            'optionalDependencies',
            'peerDependencies',
            'resolutions',
            'engines',
            'packageManager',
            'readme'
          ],
          pathPattern: '^$'
        }
      ]
    }
  },
  {
    files: ['**/*.+(yaml|yml)'],
    languageOptions: {
      parser: await import('yaml-eslint-parser')
    },
    plugins: {
      yml: /** @type {any} */ ((await import('eslint-plugin-yml')).default)
    },
    rules: {
      'spaced-comment': 0,
      'yml/block-mapping': 2,
      'yml/block-mapping-question-indicator-newline': [2, 'never'],
      'yml/block-sequence': 2,
      'yml/block-sequence-hyphen-indicator-newline': [2, 'never'],
      'yml/flow-mapping-curly-newline': 2,
      'yml/flow-mapping-curly-spacing': [
        2,
        'always',
        {
          arraysInObjects: false,
          objectsInObjects: false
        }
      ],
      'yml/flow-sequence-bracket-newline': 2,
      'yml/flow-sequence-bracket-spacing': 2,
      'yml/indent': [2, 2],
      'yml/key-name-casing': [
        2,
        {
          SCREAMING_SNAKE_CASE: true,
          camelCase: false,
          'kebab-case': true,
          snake_case: true
        }
      ],
      'yml/key-spacing': 2,
      'yml/no-empty-document': 0,
      'yml/no-empty-key': 2,
      'yml/no-empty-mapping-value': 0,
      'yml/no-empty-sequence-entry': 2,
      'yml/no-irregular-whitespace': 2,
      'yml/no-multiple-empty-lines': [2, { max: 2, maxBOF: 0, maxEOF: 1 }],
      'yml/no-tab-indent': 2,
      'yml/plain-scalar': [2, 'always'],
      'yml/quotes': [2, { avoidEscape: true, prefer: 'single' }],
      'yml/require-string-key': 2,
      'yml/sort-keys': [
        2,
        {
          order: { caseSensitive: true, type: 'asc' },
          pathPattern: '^$'
        }
      ],
      'yml/sort-sequence-values': [
        2,
        {
          order: { caseSensitive: true, type: 'asc' },
          pathPattern: '^$'
        }
      ],
      'yml/spaced-comment': 2
    }
  },
  {
    files: ['.github/ISSUE_TEMPLATE/*.yml'],
    rules: {
      'yml/sort-keys': [
        2,
        {
          order: [
            'name',
            'description',
            'title',
            'assignees',
            'labels',
            'body'
          ],
          pathPattern: '^$'
        }
      ]
    }
  },
  {
    files: ['.github/ISSUE_TEMPLATE/config.yml'],
    rules: {
      'yml/sort-keys': [
        2,
        {
          order: { caseSensitive: true, type: 'asc' },
          pathPattern: '^$'
        }
      ]
    }
  },
  {
    files: ['.github/dependabot.yml'],
    rules: {
      'yml/sort-keys': [
        2,
        {
          order: ['version', 'registries', 'updates'],
          pathPattern: '^$'
        }
      ]
    }
  },
  {
    files: ['.github/workflows/*.yml'],
    rules: {
      'yml/sort-keys': [
        2,
        {
          order: ['name', 'on', 'permissions', 'env', 'concurrency', 'jobs'],
          pathPattern: '^$'
        }
      ]
    }
  },
  {
    files: ['.github/workflows/*.yml', '.yarnrc.yml', 'docker*.yml'],
    rules: {
      'yml/key-name-casing': 0
    }
  },
  {
    files: ['.vscode/launch.json'],
    rules: {
      'jsonc/sort-keys': 0
    }
  },
  {
    files: ['action.yml'],
    rules: {
      'yml/sort-keys': [
        2,
        {
          order: [
            'name',
            'author',
            'description',
            'inputs',
            'outputs',
            'runs',
            'branding'
          ],
          pathPattern: '^$'
        }
      ]
    }
  },
  {
    files: ['docker*.yml', '**/*.md/*.+(yaml|yml)'],
    rules: {
      'yml/sort-keys': 0
    }
  }
]
