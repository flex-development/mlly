/**
 * @file Vitest Configuration
 * @module config/vitest
 * @see https://vitest.dev/config/
 */

import pathe from '@flex-development/pathe'
import { NodeEnv } from '@flex-development/tutils'
import ci from 'is-ci'
import tsconfigpaths from 'vite-tsconfig-paths'
import GithubActionsReporter from 'vitest-github-actions-reporter'
import {
  defineConfig,
  type UserConfig,
  type UserConfigExport
} from 'vitest/config'
import { BaseSequencer } from 'vitest/node'

/**
 * Vitest configuration export.
 *
 * @const {UserConfigExport} config
 */
const config: UserConfigExport = defineConfig((): UserConfig => {
  /**
   * [`lint-staged`][1] check.
   *
   * [1]: https://github.com/okonet/lint-staged
   *
   * @const {boolean} LINT_STAGED
   */
  const LINT_STAGED: boolean = !!Number.parseInt(process.env.LINT_STAGED ?? '0')

  return {
    define: {
      'import.meta.env.NODE_ENV': JSON.stringify(NodeEnv.TEST)
    },
    mode: NodeEnv.TEST,
    plugins: [tsconfigpaths({ projects: [pathe.resolve('tsconfig.json')] })],
    test: {
      allowOnly: !ci,
      clearMocks: true,
      coverage: {
        all: !LINT_STAGED,
        clean: true,
        cleanOnRerun: true,
        exclude: [
          '**/__mocks__/**',
          '**/__tests__/**',
          '**/index.ts',
          'src/interfaces/',
          'src/types/'
        ],
        extension: ['.ts'],
        include: ['src'],
        reporter: [ci ? 'lcovonly' : 'lcov', 'text'],
        reportsDirectory: './coverage',
        skipFull: false
      },
      globalSetup: [
        './__tests__/setup/setup.ts',
        './__tests__/setup/teardown.ts'
      ],
      globals: true,
      hookTimeout: 10 * 1000,
      include: [
        '**/__tests__/*.spec.ts',
        LINT_STAGED ? '**/__tests__/*.spec-d.ts' : ''
      ].filter(pattern => pattern.length > 0),
      isolate: true,
      mockReset: true,
      outputFile: { json: './__tests__/report.json' },
      passWithNoTests: true,
      reporters: [
        'json',
        'verbose',
        ci ? new GithubActionsReporter() : './__tests__/reporters/notifier.ts'
      ],
      /**
       * Stores snapshots next to `file`'s directory.
       *
       * @param {string} file - Path to test file
       * @param {string} extension - Snapshot extension
       * @return {string} Custom snapshot path
       */
      resolveSnapshotPath(file: string, extension: string): string {
        return pathe.resolve(
          pathe.resolve(pathe.dirname(pathe.dirname(file)), '__snapshots__'),
          pathe.basename(file).replace(/\.spec.tsx?/, '') + extension
        )
      },
      restoreMocks: true,
      root: process.cwd(),
      sequence: {
        sequencer: class Sequencer extends BaseSequencer {
          /**
           * Determines test file execution order.
           *
           * @public
           * @override
           * @async
           *
           * @param {string[]} files - Paths to test files
           * @return {Promise<string[]>} `files` sorted
           */
          public override async sort(files: string[]): Promise<string[]> {
            return (await super.sort(files)).sort((a, b) => a.localeCompare(b))
          }
        }
      },
      setupFiles: ['./__tests__/setup/index.ts'],
      silent: false,
      snapshotFormat: {
        callToJSON: true,
        min: false,
        printFunctionName: true
      },
      testTimeout: 15 * 1000,
      typecheck: {
        allowJs: false,
        checker: 'vue-tsc',
        ignoreSourceErrors: false,
        include: ['**/__tests__/*.spec-d.ts'],
        tsconfig: pathe.resolve('tsconfig.typecheck.json')
      }
    }
  }
})

export default config
