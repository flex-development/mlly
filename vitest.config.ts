/**
 * @file Vitest Configuration
 * @module config/vitest
 * @see https://vitest.dev/config/
 */

import pathe from '@flex-development/pathe'
import { NodeEnv, template } from '@flex-development/tutils'
import ci from 'is-ci'
import tsconfigpaths from 'vite-tsconfig-paths'
import GithubActionsReporter from 'vitest-github-actions-reporter'
import {
  defineConfig,
  type UserConfig,
  type UserConfigExport
} from 'vitest/config'
import { BaseSequencer, type WorkspaceSpec } from 'vitest/node'

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

  /**
   * Boolean indicating if the current running version of [`typescript`][1] is
   * at least `5`.
   *
   * @const {boolean} TYPESCRIPT_V5
   */
  const TYPESCRIPT_V5: boolean =
    process.env.TYPESCRIPT_VERSION?.startsWith('5') ?? true

  return {
    define: {
      'import.meta.env.NODE_ENV': JSON.stringify(NodeEnv.TEST)
    },
    plugins: [tsconfigpaths({ projects: [pathe.resolve('tsconfig.json')] })],
    test: {
      allowOnly: !ci,
      benchmark: {},
      chaiConfig: {
        includeStack: true,
        showDiff: true,
        truncateThreshold: 0
      },
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
        provider: 'c8',
        reporter: [ci ? 'lcovonly' : 'lcov', 'text'],
        reportsDirectory: './coverage',
        skipFull: false
      },
      environment: 'node',
      environmentOptions: {},
      globalSetup: [],
      globals: true,
      hookTimeout: 10 * 1000,
      include: [`**/__tests__/*.spec${LINT_STAGED ? ',spec-d' : ''}.{ts,tsx}`],
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
           * @param {WorkspaceSpec[]} specs - Workspace spec objects
           * @return {Promise<WorkspaceSpec[]>} `files` sorted
           */
          public override async sort(
            specs: WorkspaceSpec[]
          ): Promise<WorkspaceSpec[]> {
            return (await super.sort(specs)).sort(([, file1], [, file2]) => {
              return file1.localeCompare(file2)
            })
          }
        }
      },
      setupFiles: ['./__tests__/setup/index.ts'],
      silent: false,
      singleThread: true,
      slowTestThreshold: 3000,
      snapshotFormat: {
        callToJSON: true,
        min: false,
        printBasicPrototype: false,
        printFunctionName: true
      },
      testTimeout: 15 * 1000,
      typecheck: {
        allowJs: false,
        checker: 'vue-tsc',
        ignoreSourceErrors: false,
        include: ['**/__tests__/*.spec-d.ts'],
        tsconfig: template('{0}/tsconfig.typecheck.json', {
          0: pathe.resolve(TYPESCRIPT_V5 ? '' : '__tests__/ts/v4')
        })
      },
      unstubEnvs: true,
      unstubGlobals: true
    }
  }
})

export default config
