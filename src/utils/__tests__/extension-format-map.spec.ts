/**
 * @file Unit Tests - EXTENSION_FORMAT_MAP
 * @module mlly/utils/tests/unit/EXTENSION_FORMAT_MAP
 */

import { Format } from '#src/enums'
import TEST_SUBJECT from '../extension-format-map'

describe('unit:utils/EXTENSION_FORMAT_MAP', () => {
  it('should map ".cjs" to Format.COMMONJS', () => {
    expect(TEST_SUBJECT.get('.cjs')).to.equal(Format.COMMONJS)
  })

  it('should map ".cts" to Format.COMMONJS', () => {
    expect(TEST_SUBJECT.get('.cts')).to.equal(Format.COMMONJS)
  })

  it('should map ".d.cts" to Format.COMMONJS', () => {
    expect(TEST_SUBJECT.get('.d.cts')).to.equal(Format.COMMONJS)
  })

  it('should map ".d.mts" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.d.mts')).to.equal(Format.MODULE)
  })

  it('should map ".d.ts" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.d.ts')).to.equal(Format.MODULE)
  })

  it('should map ".js" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.js')).to.equal(Format.MODULE)
  })

  it('should map ".json" to Format.JSON', () => {
    expect(TEST_SUBJECT.get('.json')).to.equal(Format.JSON)
  })

  it('should map ".jsx" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.jsx')).to.equal(Format.MODULE)
  })

  it('should map ".mjs" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.mjs')).to.equal(Format.MODULE)
  })

  it('should map ".mts" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.mts')).to.equal(Format.MODULE)
  })

  it('should map ".node" to Format.COMMONJS', () => {
    expect(TEST_SUBJECT.get('.node')).to.equal(Format.COMMONJS)
  })

  it('should map ".ts" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.ts')).to.equal(Format.MODULE)
  })

  it('should map ".tsx" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.tsx')).to.equal(Format.MODULE)
  })

  it('should map ".wasm" to Format.WASM', () => {
    expect(TEST_SUBJECT.get('.wasm')).to.equal(Format.WASM)
  })
})
