/**
 * @file Unit Tests - CONDITIONS
 * @module mlly/utils/tests/unit/CONDITIONS
 */

import TEST_SUBJECT from '../conditions'

describe('unit:utils/CONDITIONS', () => {
  it('should be readonly set', () => {
    expect(TEST_SUBJECT).to.be.frozen.instanceof(Set)
  })

  it('should be sorted by priority', () => {
    expect([...TEST_SUBJECT.values()]).to.deep.equal(['node', 'import'])
  })
})
