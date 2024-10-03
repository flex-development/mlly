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
import { dedent } from 'ts-dedent'
import type { RunnerTask, RunnerTestCase, RunnerTestFile } from 'vitest'
import type { Vitest } from 'vitest/node'
import type { Reporter } from 'vitest/reporters'

/**
 * Test report summary notifier.
 *
 * @see {@linkcode Reporter}
 *
 * @implements {Reporter}
 */
class Notifier implements Reporter {
  /**
   * Reporter context.
   *
   * @see {@linkcode Vitest}
   *
   * @public
   * @instance
   * @member {Vitest} ctx
   */
  public ctx!: Vitest

  /**
   * Test run end time (in milliseconds).
   *
   * @public
   * @instance
   * @member {number} end
   */
  public end!: number

  /**
   * Test run start time (in milliseconds).
   *
   * @public
   * @instance
   * @member {number} start
   */
  public start!: number

  /**
   * Send a notification after all tests have ran (in non ci/cd environments).
   *
   * @see {@linkcode RunnerTestFile}
   *
   * @public
   * @instance
   *
   * @async
   *
   * @param {RunnerTestFile[] | undefined} [files=this.ctx.state.getFiles()]
   *  List of test files
   * @param {unknown[] | undefined} [errors=this.ctx.state.getUnhandledErrors()]
   *  List of unhandled errors
   * @return {undefined}
   */
  public async onFinished(
    files: RunnerTestFile[] = this.ctx.state.getFiles(),
    errors: unknown[] = this.ctx.state.getUnhandledErrors()
  ): Promise<undefined> {
    this.end = performance.now()
    return void await (ci || this.reportSummary(files, errors))
  }

  /**
   * Initialize the reporter.
   *
   * @see {@linkcode Vitest}
   *
   * @public
   * @instance
   *
   * @param {Vitest} ctx
   *  Reporter context
   * @return {undefined}
   */
  public onInit(ctx: Vitest): undefined {
    return void (this.ctx = ctx, this.start = performance.now())
  }

  /**
   * Send a notification.
   *
   * @see {@linkcode RunnerTestFile}
   *
   * @public
   * @instance
   *
   * @async
   *
   * @param {RunnerTestFile[] | undefined} [files=this.ctx.state.getFiles()]
   *  List of test files
   * @param {unknown[] | undefined} [errors=this.ctx.state.getUnhandledErrors()]
   *  List of unhandled errors
   * @return {Promise<undefined>}
   */
  public async reportSummary(
    files: RunnerTestFile[] = this.ctx.state.getFiles(),
    errors: unknown[] = this.ctx.state.getUnhandledErrors()
  ): Promise<undefined> {
    /**
     * Tests that have been run.
     *
     * @const {RunnerTestCase[]} tests
     */
    const tests: RunnerTestCase[] = this.tests(files)

    /**
     * Total number of failed tests.
     *
     * @const {number} fails
     */
    const fails: number = tests.filter(t => t.result?.state === 'fail').length

    /**
     * Total number of passed tests.
     *
     * @const {number} passes
     */
    const passes: number = tests.filter(t => t.result?.state === 'pass').length

    /**
     * Notification message.
     *
     * @var {string} message
     */
    let message: string = ''

    /**
     * Notification title.
     *
     * @var {string} title
     */
    let title: string = ''

    // get notification title and message based on number of failed tests
    if (fails || errors.length > 0) {
      message = dedent`
        ${fails} of ${tests.length} tests failed
        ${errors.length} unhandled errors
      `

      title = '\u274C Failed'
    } else {
      /**
       * Time to run all tests (in milliseconds).
       *
       * @const {number} time
       */
      const time: number = this.end - this.start

      message = dedent`
        ${passes} tests passed in ${
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

  /**
   * Convert tasks to a list of test cases.
   *
   * @see {@linkcode RunnerTask}
   * @see {@linkcode RunnerTestCase}
   *
   * @protected
   * @instance
   *
   * @param {RunnerTask | RunnerTask[]} [tasks=[]]
   *  Tasks to collect tests from
   * @return {RunnerTestCase[]}
   *  List of runner test cases
   */
  protected tests(tasks: RunnerTask | RunnerTask[] = []): RunnerTestCase[] {
    return (Array.isArray(tasks) ? tasks : [tasks]).flatMap(task => {
      return task.type === 'custom' || task.type === 'test'
        ? [task as unknown as RunnerTestCase]
        : 'tasks' in task
        ? task.tasks.flatMap(task => this.tests(task))
        : []
    })
  }
}

export default Notifier
