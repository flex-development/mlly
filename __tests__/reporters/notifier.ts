/**
 * @file Reporters - Notifier
 * @module tests/reporters/Notifier
 */

import type { OneOrMany } from '@flex-development/tutils'
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
   * @public
   * @member {Vitest} ctx - Test reporter context
   */
  public ctx: Vitest = {} as Vitest

  /**
   * @public
   * @member {number} end - Test run end time (in milliseconds)
   */
  public end: number = 0

  /**
   * @public
   * @member {number} start - Test run start time (in milliseconds)
   */
  public start: number = 0

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
    /** @const {Test[]} tests - Tests run */
    const tests: Test[] = this.tests(files)

    /** @const {number} fails - Total number of failed tests */
    const fails: number = tests.filter(t => t.result?.state === 'fail').length

    /** @const {number} passes - Total number of passed tests */
    const passes: number = tests.filter(t => t.result?.state === 'pass').length

    /** @var {string} message - Notification message */
    let message: string = ''

    /** @var {string} title - Notification title */
    let title: string = ''

    // get notification title and message based on number of failed tests
    if (fails || errors.length > 0) {
      message = dedent`
        ${fails} of ${tests.length} tests failed
        ${errors.length} unhandled errors
      `

      title = '\u274C Failed'
    } else {
      /** @const {number} time - Time to run all tests (in milliseconds) */
      const time: number = this.end - this.start

      message = dedent`
        ${passes} tests passed in ${
        time > 1000 ? `${(time / 1000).toFixed(2)}ms` : `${Math.round(time)}ms`
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
    return void (this.start = performance.now())
  }

  /**
   * Returns an array of {@link Test} objects.
   *
   * @protected
   *
   * @param {OneOrMany<Task>} [tasks=[]] - Tasks to collect tests from
   * @return {Test[]} `Test` object array
   */
  protected tests(tasks: OneOrMany<Task> = []): Test[] {
    const { mode } = this.ctx

    return (Array.isArray(tasks) ? tasks : [tasks]).flatMap(task => {
      const { type } = task

      if (mode === 'typecheck' && type === 'suite' && task.tasks.length === 0) {
        return [task] as unknown as [Test]
      }

      return type === 'benchmark' || type === 'typecheck'
        ? []
        : type === 'test'
        ? [task]
        : task.tasks.flatMap(t => (t.type === 'test' ? [t] : this.tests(t)))
    })
  }
}

export default Notifier
