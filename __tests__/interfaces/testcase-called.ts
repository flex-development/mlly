/**
 * @file Test Environment Interfaces - TestcaseCalled
 * @module tests/interfaces/TestcaseCalled
 */

import type Testcase from './testcase'

/**
 * Object representing a function call count test case.
 *
 * @extends {Testcase<number>}
 */
interface TestcaseCalled extends Testcase<number> {
  call: 'call' | 'not call'
}

export { type TestcaseCalled as default }
