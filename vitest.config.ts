/**
 * @file Vitest Configuration
 * @module config/vitest
 * @see https://vitest.dev/config
 */

import { NodeEnv } from '@flex-development/tutils'
import ci from 'is-ci'
import path from 'node:path'
import type { UserConfig } from 'vite'
import tsconfigpaths from 'vite-tsconfig-paths'
import GithubActionsReporter from 'vitest-github-actions-reporter'
import { BaseSequencer } from 'vitest/node'

/**
 * Creates a {@link UserConfig} object for test environments.
 *
 * @return {UserConfig} Vitest configuration options
 */
const config = (): UserConfig => {
  /**
   * Absolute path to [experimental loader for Node.js][1].
   *
   * [1]: https://nodejs.org/docs/latest-v16.x/api/esm.html#loaders
   *
   * @const {string} NODE_LOADER_PATH
   */
  const NODE_LOADER_PATH: string = path.resolve('loader.mjs')

  /**
   * Absolute path to tsconfig file.
   *
   * @const {string} TSCONFIG_PATH
   */
  const TSCONFIG_PATH: string = path.resolve('tsconfig.json')

  return {
    define: {
      'import.meta.env.CI': JSON.stringify(ci),
      'import.meta.env.NODE_ENV': JSON.stringify(NodeEnv.TEST),
      'process.env.NODE_OPTIONS': JSON.stringify(`--loader=${NODE_LOADER_PATH}`)
    },
    mode: NodeEnv.TEST,
    plugins: [tsconfigpaths({ projects: [TSCONFIG_PATH] })],
    test: {
      allowOnly: !ci,
      clearMocks: true,
      coverage: {
        all: true,
        clean: true,
        exclude: [
          '**/__mocks__/**',
          '**/__tests__/**',
          '**/index.ts',
          'src/interfaces',
          'src/internal/compiler-options-json.ts',
          'src/types'
        ],
        extension: ['.ts'],
        include: ['src'],
        reporter: ['json-summary', 'lcov', 'text'],
        reportsDirectory: './coverage',
        skipFull: false
      },
      globalSetup: [
        './__tests__/setup/setup.ts',
        './__tests__/setup/teardown.ts'
      ],
      globals: true,
      hookTimeout: 10 * 1000,
      include: ['**/__tests__/*.spec.ts'],
      isolate: true,
      mockReset: true,
      outputFile: {
        json: './__tests__/report.json'
      },
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
        return path.resolve(
          path.resolve(path.dirname(path.dirname(file)), '__snapshots__'),
          path.basename(file).replace(/\.spec.tsx?/, '') + extension
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
      testTimeout: 15 * 1000
    }
  }
}

export default config
