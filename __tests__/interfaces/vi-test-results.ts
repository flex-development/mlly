/**
 * @file Test Environment Interfaces - ViTestResults
 * @module tests/interfaces/ViTestResults
 */

import type ViTestResult from './vi-test-result'

/**
 * Test results object produced by the `vitest` [`JsonReporter`][1].
 *
 * [1]: https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/reporters/json.ts
 */
interface ViTestResults {
  numFailedTestSuites: number
  numFailedTests: number
  numPassedTestSuites: number
  numPassedTests: number
  numPendingTestSuites: number
  numPendingTests: number
  numTodoTests: number
  numTotalTestSuites: number
  numTotalTests: number
  startTime: number
  success: boolean
  testResults: ViTestResult[]
}

export { type ViTestResults as default }
