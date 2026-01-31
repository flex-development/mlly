/**
 * @file Unit Tests - isImportsSubpath
 * @module mlly/lib/tests/unit/isImportsSubpath
 */

import chars from '#internal/chars'
import testSubject from '#lib/is-imports-subpath'
import pkg from '@flex-development/mlly/package.json'

describe('unit:lib/isImportsSubpath', () => {
  it('should return `false` if `value` cannot be `imports` subpath', () => {
    expect(testSubject(pkg.name)).to.be.false
  })

  it('should return `true` if `value` looks like `imports` subpath', () => {
    expect(testSubject(chars.hash + 'internal/chars')).to.be.true
  })
})
