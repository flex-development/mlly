/**
 * @file Unit Tests - EXTENSION_FORMAT_MAP
 * @module mlly/utils/tests/unit/EXTENSION_FORMAT_MAP
 */

import { Format } from '#src/enums'
import TEST_SUBJECT from '../extension-format-map'

describe('unit:utils/EXTENSION_FORMAT_MAP', () => {
  it('should map ".cjs" to Format.COMMONJS', () => {
    expect(TEST_SUBJECT.get('.cjs')).equal(Format.COMMONJS)
  })

  it('should map ".cts" to Format.COMMONJS', () => {
    expect(TEST_SUBJECT.get('.cts')).equal(Format.COMMONJS)
  })

  it('should map ".d.cts" to Format.COMMONJS', () => {
    expect(TEST_SUBJECT.get('.d.cts')).equal(Format.COMMONJS)
  })

  it('should map ".d.mts" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.d.mts')).equal(Format.MODULE)
  })

  it('should map ".d.ts" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.d.ts')).equal(Format.MODULE)
  })

  it('should map ".js" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.js')).equal(Format.MODULE)
  })

  it('should map ".json" to Format.JSON', () => {
    expect(TEST_SUBJECT.get('.json')).equal(Format.JSON)
  })

  it('should map ".jsx" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.jsx')).equal(Format.MODULE)
  })

  it('should map ".mjs" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.mjs')).equal(Format.MODULE)
  })

  it('should map ".mts" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.mts')).equal(Format.MODULE)
  })

  it('should map ".node" to Format.COMMONJS', () => {
    expect(TEST_SUBJECT.get('.node')).equal(Format.COMMONJS)
  })

  it('should map ".ts" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.ts')).equal(Format.MODULE)
  })

  it('should map ".tsx" to Format.MODULE', () => {
    expect(TEST_SUBJECT.get('.tsx')).equal(Format.MODULE)
  })

  it('should map ".wasm" to Format.WASM', () => {
    expect(TEST_SUBJECT.get('.wasm')).equal(Format.WASM)
  })
})
