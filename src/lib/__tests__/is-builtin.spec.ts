/**
 * @file Unit Tests - isBuiltin
 * @module mlly/lib/tests/isBuiltin/unit
 */

import testSubject from '../is-builtin'

describe('unit:lib/isBuiltin', () => {
  it('should return false if module is maintained by third-party', () => {
    expect(testSubject('@flex-development/mlly')).to.be.false
  })

  it('should return true for builtin module', () => {
    expect(testSubject('fs')).to.be.true
  })

  it('should return true for builtin module containing node protocol', () => {
    expect(testSubject('node:fs')).to.be.true
  })
})
