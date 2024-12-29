/**
 * @file Reporters - VerboseReporter
 * @module tests/reporters/VerboseReporter
 * @see https://vitest.dev/advanced/reporters#exported-reporters
 */

import type { Task, TaskResultPack } from '@vitest/runner'
import { getNames, getTests } from '@vitest/runner/utils'
import colors, { type Colors } from 'tinyrainbow'
import type { RunnerTask, RunnerTestFile } from 'vitest'
import { DefaultReporter, type Reporter } from 'vitest/reporters'

/**
 * Verbose reporter.
 *
 * @see {@linkcode DefaultReporter}
 * @see {@linkcode Reporter}
 *
 * @extends {DefaultReporter}
 * @implements {Reporter}
 */
class VerboseReporter extends DefaultReporter implements Reporter {
  /**
   * Color functions map.
   *
   * @public
   * @instance
   * @member {Colors} colors
   */
  public colors: Colors

  /**
   * Create a new verbose reporter.
   */
  constructor() {
    super({ summary: true })

    this.colors = colors
    this.renderSucceed = true
    this.verbose = true
  }

  /**
   * Format a project `name`.
   *
   * @protected
   * @instance
   *
   * @param {string | null | undefined} name
   *  The project name to format
   * @param {boolean | null | undefined} dim
   *  Dim formattted project name?
   * @return {string}
   *  Formatted project name
   */
  protected formatProjectName(
    name: string | null | undefined,
    dim?: boolean | null | undefined
  ): string {
    if (name) {
      name = this.colors.magenta(`[${name}]`)
      if (dim) name = this.colors.dim(name)
      return name
    }

    return ''
  }

  /**
   * Get a symbol representing `task`.
   *
   * @see {@linkcode RunnerTask}
   *
   * @protected
   * @instance
   *
   * @param {RunnerTask} task
   *  The runner task to handle
   * @return {string}
   *  Task state symbol
   */
  protected getTaskSymbol(task: RunnerTask): string {
    if (task.mode === 'skip') return this.colors.dim(this.colors.gray('↓'))

    if (task.mode === 'todo') return this.colors.yellow('→')

    if (!task.result) return this.colors.gray('.')

    if (task.result.state === 'pass') {
      return this.colors.green(task.meta.benchmark ? '·' : '✓')
    }

    if (task.result.state === 'fail') {
      return this.colors.red(task.type === 'suite' ? '❯' : '✖')
    }

    return ''
  }

  /**
   * Print tasks.
   *
   * @see {@linkcode RunnerTestFile}
   *
   * @public
   * @override
   * @instance
   *
   * @param {RunnerTestFile[] | undefined} [files]
   *  List of test files
   * @param {unknown[] | undefined} [errors]
   *  List of unhandled errors
   * @return {undefined}
   */
  public override onFinished(
    files?: RunnerTestFile[] | undefined,
    errors?: unknown[] | undefined
  ): undefined {
    if (files) { for (const task of files) this.printTask(task, true) }
    return void super.onFinished(files, errors)
  }

  /**
   * Handle task updates.
   *
   * @see {@linkcode TaskResultPack}
   *
   * @public
   * @override
   * @instance
   *
   * @param {TaskResultPack[]} packs
   *  List of task result packs
   * @return {undefined}
   */
  public override onTaskUpdate(packs: TaskResultPack[]): undefined {
    return void (this.isTTY && void super.onTaskUpdate(packs))
  }

  /**
   * Print `task`.
   *
   * @see {@linkcode Task}
   *
   * @protected
   * @override
   * @instance
   *
   * @param {Task | null | undefined} task
   *  The task to handle
   * @param {boolean | null | undefined} [force]
   *  Print `task` even when {@linkcode isTTY} is `false`?
   * @return {undefined}
   */
  protected override printTask(
    task: Task | null | undefined,
    force?: boolean | null | undefined
  ): undefined {
    if (
      (!this.isTTY || force) &&
      task?.result?.state &&
      task.result.state !== 'queued' &&
      task.result.state !== 'run'
    ) {
      /**
       * Task skipped?
       *
       * @const {boolean} skip
       */
      const skip: boolean = task.mode === 'skip'

      /**
       * Printed task.
       *
       * @var {string} state
       */
      let state: string = ''

      state = ' '.repeat(getNames(task).length * 2)
      state += this.getTaskSymbol(task) + ' '

      if (task.type !== 'suite') {
        this.log(state += skip ? this.colors.blackBright(task.name) : task.name)
      } else {
        /**
         * Suite title.
         *
         * @var {string} suite
         */
        let suite: string = ''

        if ('filepath' in task) {
          suite = task.file.name

          if (task.file.projectName) {
            state += this.formatProjectName(task.file.projectName, skip) + ' '
          }
        } else {
          suite = task.name
        }

        suite += ` (${getTests(task).length})`
        state += skip ? this.colors.blackBright(suite) : suite

        this.log(state)

        if (!skip) {
          for (const subtask of task.tasks) void this.printTask(subtask, force)
        }
      }
    }

    return void task
  }
}

export default VerboseReporter
