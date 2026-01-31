/**
 * @file Reporters - Notifier
 * @module tests/reporters/Notifier
 * @see https://vitest.dev/advanced/reporters#exported-reporters
 */

import ci from 'is-ci'
import notifier from 'node-notifier'
import type { Notification } from 'node-notifier/notifiers/notificationcenter'
import { performance } from 'node:perf_hooks'
import { promisify } from 'node:util'
import type { SerializedError } from 'vitest'
import type { TestCase, TestModule, Vitest } from 'vitest/node'
import type { Reporter } from 'vitest/reporters'

/**
 * Test report summary notifier.
 *
 * @implements {Reporter}
 */
class Notifier implements Reporter {
  /**
   * The reporter context.
   *
   * @see {@linkcode Vitest}
   *
   * @protected
   * @instance
   * @member {Vitest} ctx
   */
  protected ctx!: Vitest

  /**
   * Map, where the first value is a timestamp indicating when all tests began
   * running, and the last value is a timestamp indicating when those tests
   * finished running.
   *
   * @protected
   * @instance
   * @member {[number, number]} timestamps
   */
  protected timestamps!: [start: number, end: number]

  /**
   * Initialize the reporter.
   *
   * @see {@linkcode Vitest}
   *
   * @public
   * @instance
   *
   * @param {Vitest} ctx
   *  The reporter context
   * @return {undefined}
   */
  public onInit(ctx: Vitest): undefined {
    this.timestamps = [-1, -1]
    if (!ci) this.timestamps[0] = performance.now()
    return void (this.ctx = ctx)
  }

  /**
   * Send a notification after a test run.
   *
   * @public
   * @instance
   * @async
   *
   * @param {ReadonlyArray<TestModule>} modules
   *  List of test modules
   * @param {ReadonlyArray<SerializedError>} errors
   *  List of unhandled errors
   * @return {Promise<undefined>}
   */
  public async onTestRunEnd(
    modules: readonly TestModule[],
    errors: readonly SerializedError[]
  ): Promise<undefined> {
    if (ci) return void this
    this.timestamps[1] = performance.now()

    /**
     * Map where each key is a test result state and each value is a list of
     * test cases.
     *
     * @const {Record<'failed' | 'passed', TestCase[]>} tests
     */
    const tests: Record<'failed' | 'passed', TestCase[]> = {
      failed: [],
      passed: []
    }

    // collect passing and failing tests.
    for (const module of modules) {
      for (const test of module.children.allTests()) {
        const { state } = test.result()
        if (state === 'failed' || state === 'passed') tests[state].push(test)
      }
    }

    /**
     * Total number of tests.
     *
     * @const {number} total
     */
    const total: number = tests.failed.length + tests.passed.length

    /**
     * The notification message text.
     *
     * @var {string} message
     */
    let message: string = ''

    /**
     * The title of the notification.
     *
     * @var {string} title
     */
    let title: string = ''

    if (tests.failed.length || errors.length > 0) {
      title = '\u274C Failed'
      message = `${tests.failed.length} of ${total} tests failed`
      message += `\n${errors.length} unhandled errors`
    } else {
      /**
       * Test run duration.
       *
       * @const {number} time
       */
      const time: number = this.timestamps[1] - this.timestamps[0]

      message = String.raw`
        ${tests.passed.length} tests passed in ${
        time > 1000
          ? `${(time / 1000).toFixed(2)}ms`
          : `${Math.round(time)}ms`
      }
      `

      title = '\u2705 Passed'
    }

    return void await promisify<Notification>(notifier.notify.bind(notifier))({
      message,
      sound: true,
      timeout: 15,
      title
    })
  }
}

export default Notifier
