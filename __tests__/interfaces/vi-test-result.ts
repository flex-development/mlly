/**
 * @file Test Environment Interfaces - ViTestResult
 * @module tests/interfaces/ViTestResult
 */

import type ViAssertionResult from './vi-assertion-result'

/**
 * Test result summary object produced by the `vitest` [`JsonReporter`][1].
 *
 * [1]: https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/reporters/json.ts
 */
interface ViTestResult {
  assertionResults: ViAssertionResult[]
  endTime: number
  message: string
  name: string
  startTime: number
  status: 'failed' | 'passed'
}

export { type ViTestResult as default }
