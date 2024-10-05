/**
 * @file Unit Tests - defaultExtensions
 * @module mlly/lib/tests/unit/defaultExtensions
 */

import testSubject from '#lib/default-extensions'

describe('unit:lib/defaultExtensions', () => {
  it('should contain default extensions', () => {
    expect(testSubject).toMatchSnapshot()
  })
})
