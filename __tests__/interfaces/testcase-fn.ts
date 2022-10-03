/**
 * @file Test Environment Interfaces - TestcaseFn
 * @module tests/interfaces/TestcaseFn
 */

import type Testcase from './testcase'

/**
 * Object representing a function test case.
 *
 * @template T - Test subject
 *
 * @extends {Testcase<ReturnType<T>>}
 */
interface TestcaseFn<T extends (...args: any[]) => any>
  extends Testcase<ReturnType<T>> {
  parameters: Parameters<T>
}

export { type TestcaseFn as default }
