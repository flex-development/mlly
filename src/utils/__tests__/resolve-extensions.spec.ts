/**
 * @file Unit Tests - RESOLVE_EXTENSIONS
 * @module mlly/utils/tests/unit/RESOLVE_EXTENSIONS
 */

import TEST_SUBJECT from '../resolve-extensions'

describe('unit:utils/RESOLVE_EXTENSIONS', () => {
  it('should be readonly array', () => {
    expect(TEST_SUBJECT).to.be.an('array').that.is.frozen
  })

  it('should be sorted by priority', () => {
    expect(TEST_SUBJECT).to.deep.equal([
      '.mjs',
      '.mts',
      '.cjs',
      '.cts',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.css',
      '.json',
      '.node',
      '.wasm',
      '.d.mts',
      '.d.cts',
      '.d.ts'
    ])
  })
})
