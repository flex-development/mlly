/**
 * @file Vitest Configuration
 * @module config/vitest
 * @see https://vitest.dev/config/
 */

import tsconfigPaths from '#tests/plugins/tsconfig-paths'
import Notifier from '#tests/reporters/notifier'
import pathe from '@flex-development/pathe'
import ci from 'is-ci'
import {
  defineConfig,
  type ConfigEnv,
  type UserConfig,
  type UserConfigExport
} from 'vitest/config'
import { BaseSequencer, type WorkspaceSpec } from 'vitest/node'
import tsconfigJson from './tsconfig.test.json'

/**
 * Vitest configuration.
 *
 * @const {UserConfigExport} config
 */
const config: UserConfigExport = defineConfig((env: ConfigEnv): UserConfig => {
  /**
   * [`lint-staged`][1] check.
   *
   * [1]: https://github.com/okonet/lint-staged
   *
   * @const {boolean} LINT_STAGED
   */
  const LINT_STAGED: boolean = !!Number.parseInt(process.env.LINT_STAGED ?? '0')

  return {
    define: {},
    plugins: [tsconfigPaths({ tsconfig: 'tsconfig.test.json' })],
    resolve: { conditions: tsconfigJson.compilerOptions.customConditions },
    test: {
      allowOnly: !ci,
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
          '**/*.d.mts',
          '**/__mocks__/',
          '**/__tests__/',
          '**/interfaces/',
          '**/types/',
          '**/index.mts',
          '!src/index.mts',
          'src/internal/*.browser.mts'
        ],
        extension: ['.mts'],
        include: ['src'],
        provider: 'v8',
        reportOnFailure: !ci,
        reporter: env.mode === 'reports'
          ? ['text']
          : [ci ? 'lcovonly' : 'html', 'json-summary', 'text'],
        reportsDirectory: './coverage',
        skipFull: false,
        thresholds: { 100: true, perFile: true }
      },
      environment: 'node',
      environmentOptions: {},
      exclude: [
        '.cache',
        '.git',
        '.idea',
        'dist',
        'node_modules'
      ],
      globalSetup: [],
      globals: true,
      hookTimeout: 10 * 1000,
      include: [`**/__tests__/*.${LINT_STAGED ? '{spec,spec-d}' : 'spec'}.mts`],
      mockReset: true,
      outputFile: {
        blob: `.vitest-reports/${env.mode}.blob.json`,
        json: pathe.join('__tests__', 'reports', env.mode + '.json')
      },
      passWithNoTests: true,
      reporters: env.mode === 'reports'
        ? ['verbose']
        : [ci ? 'github-actions' : new Notifier(), 'blob', 'json', 'verbose'],
      /**
       * Stores snapshots next to `file`'s directory.
       *
       * @param {string} file
       *  Path to test file
       * @param {string} extension
       *  Snapshot extension
       * @return {string}
       *  Custom snapshot path
       */
      resolveSnapshotPath(file: string, extension: string): string {
        return pathe.resolve(
          pathe.resolve(pathe.dirname(pathe.dirname(file)), '__snapshots__'),
          pathe.basename(file).replace(/\.spec.mts/, '') + extension
        )
      },
      restoreMocks: true,
      sequence: {
        /**
         * Sorting and sharding algorithm provider.
         *
         * @see {@linkcode BaseSequencer}
         *
         * @extends {BaseSequencer}
         */
        sequencer: class Sequencer extends BaseSequencer {
          /**
           * Determines test file execution order.
           *
           * @public
           * @override
           * @async
           *
           * @param {WorkspaceSpec[]} specs
           *  Workspace spec objects
           * @return {Promise<WorkspaceSpec[]>}
           *  `files` sorted
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
      setupFiles: ['./__tests__/setup/chai.mts', './__tests__/setup/faker.mts'],
      slowTestThreshold: 3000,
      snapshotFormat: {
        callToJSON: true,
        min: false,
        printBasicPrototype: false,
        printFunctionName: true
      },
      snapshotSerializers: ['./__tests__/serializers/cwd.mts'],
      typecheck: {
        allowJs: false,
        checker: 'tsc',
        ignoreSourceErrors: false,
        include: ['**/__tests__/*.spec-d.mts'],
        only: true,
        tsconfig: 'tsconfig.typecheck.json'
      },
      unstubEnvs: true,
      unstubGlobals: true
    }
  }
})

export default config
