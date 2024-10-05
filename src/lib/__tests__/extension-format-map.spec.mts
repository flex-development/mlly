/**
 * @file Unit Tests - extensionFormatMap
 * @module mlly/lib/tests/unit/extensionFormatMap
 */

import testSubject from '#lib/extension-format-map'

describe('unit:lib/extensionFormatMap', () => {
  it('should map extensions to module formats', () => {
    expect(testSubject).toMatchSnapshot()
  })
})
