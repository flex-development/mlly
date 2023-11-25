/**
 * @file Reporters - Notifier
 * @module tests/reporters/Notifier
 */

import { cast, isArray, type OneOrMany } from '@flex-development/tutils'
import notifier from 'node-notifier'
import type NotificationCenter from 'node-notifier/notifiers/notificationcenter'
import { performance } from 'node:perf_hooks'
import { promisify } from 'node:util'
import { dedent } from 'ts-dedent'
import type { File, Reporter, Task, Test, Vitest } from 'vitest'

/**
 * Custom reporter that sends a notification when all tests have been ran.
 *
 * @see https://vitest.dev/config/#reporters
 *
 * @implements {Reporter}
 */
class Notifier implements Reporter {
  /**
   * Test reporter context.
   *
   * @public
   * @member {Vitest} ctx
   */
  public ctx!: Vitest

  /**
   * Test run end time (in milliseconds).
   *
   * @public
   * @member {number} end
   */
  public end!: number

  /**
   * Test run start time (in milliseconds).
   *
   * @public
   * @member {number} start
   */
  public start!: number

  /**
   * Sends a notification.
   *
   * @protected
   *
   * @async
   *
   * @param {File[]} [files=this.ctx.state.getFiles()] - File objects
   * @param {unknown[]} [errors=this.ctx.state.getUnhandledErrors()] - Errors
   * @return {Promise<void>} Nothing when complete
   */
  protected async notify(
    files: File[] = this.ctx.state.getFiles(),
    errors: unknown[] = this.ctx.state.getUnhandledErrors()
  ): Promise<void> {
    /**
     * Tests that have been run.
     *
     * @const {Test[]} tests
     */
    const tests: Test[] = this.tests(files)

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

    // send notification
    return void (await promisify<NotificationCenter.Notification>(
      notifier.notify.bind(notifier)
    )({
      message,
      sound: true,
      timeout: 10,
      title
    }))
  }

  /**
   * Sends a notification after all tests have ran (in non ci/cd environments).
   *
   * @public
   *
   * @async
   *
   * @param {File[]} [files=this.ctx.state.getFiles()] - File objects
   * @param {unknown[]} [errors=this.ctx.state.getUnhandledErrors()] - Errors
   * @return {Promise<void>} Nothing when complete
   */
  public async onFinished(
    files: File[] = this.ctx.state.getFiles(),
    errors: unknown[] = this.ctx.state.getUnhandledErrors()
  ): Promise<void> {
    this.end = performance.now()
    return void (await this.notify(files, errors))
  }

  /**
   * Initializes the reporter.
   *
   * @public
   *
   * @param {Vitest} context - Test reporter context
   * @return {void} Nothing when complete
   */
  public onInit(context: Vitest): void {
    this.ctx = context
    return void ((this.start = performance.now()) && (this.end = 0))
  }

  /**
   * Returns an array of {@linkcode Test} objects.
   *
   * @protected
   *
   * @param {OneOrMany<Task>} [tasks=[]] - Tasks to collect tests from
   * @return {Test[]} `Test` object array
   */
  protected tests(tasks: OneOrMany<Task> = []): Test[] {
    return (isArray<Task>(tasks) ? tasks : [tasks]).flatMap(task => {
      return task.type === 'custom'
        ? [cast(task)]
        : task.type === 'test'
        ? [task]
        : 'tasks' in task
        ? task.tasks.flatMap(task => this.tests(task))
        : []
    })
  }
}

export default Notifier
