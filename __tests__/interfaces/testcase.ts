/**
 * @file Test Environment Interfaces - Testcase
 * @module tests/interfaces/Testcase
 */

/**
 * Object representing a test case.
 *
 * @template Expected - Type of expected value
 *
 * @example
 *  function testSubject(nums: number[], target: number): number {
 *    // some work
 *  }
 *
 *  type Case = Testcase<ReturnType<typeof testSubject>> & {
 *    parameters: Parameters<typeof testSubject>
 *  }
 *
 *  const cases: Case[] = [
 *    { expected: 5, parameters: [[5], 5] },
 *    { expected: -1, parameters: [[4, 5, 6, 7, 9], 2] },
 *    { expected: 4, parameters: [[-1, 0, 3, 5, 9, 12], 9] },
 *  ]
 *
 *  cases.forEach(({ expected, nums, target }) => {
 *    it(`should return ${expected} given [${pf(nums)}, ${pf(target)}]` => {
 *      expect(testSubject(...parameters)).to.equal(expected)
 *    })
 *  })
 */
interface Testcase<Expected = any> {
  expected: Expected
}

export { type Testcase as default }
