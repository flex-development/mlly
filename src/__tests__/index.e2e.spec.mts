/**
 * @file E2E Tests - api
 * @module mlly/tests/e2e/api
 */

import * as testSubject from '@flex-development/mlly'

describe('e2e:mlly', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
