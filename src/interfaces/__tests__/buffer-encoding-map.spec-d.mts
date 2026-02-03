/**
 * @file Type Tests - BufferEncodingMap
 * @module mlly/interfaces/tests/unit-d/BufferEncodingMap
 */

import type TestSubject from '#interfaces/buffer-encoding-map'

describe('unit-d:interfaces/BufferEncodingMap', () => {
  it('should match [ascii: "ascii"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ascii')
      .toEqualTypeOf<'ascii'>()
  })

  it('should match [base64: "base64"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('base64')
      .toEqualTypeOf<'base64'>()
  })

  it('should match [base64url: "base64url"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('base64url')
      .toEqualTypeOf<'base64url'>()
  })

  it('should match [binary: "binary"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('binary')
      .toEqualTypeOf<'binary'>()
  })

  it('should match [hex: "hex"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('hex')
      .toEqualTypeOf<'hex'>()
  })

  it('should match [latin1: "latin1"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('latin1')
      .toEqualTypeOf<'latin1'>()
  })

  it('should match [ucs2: "ucs2" | "ucs-2"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('ucs2')
      .toEqualTypeOf<'ucs2' | 'ucs-2'>()
  })

  it('should match [utf16le: "utf16le" | "utf-16le"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('utf16le')
      .toEqualTypeOf<'utf16le' | 'utf-16le'>()
  })

  it('should match [utf8: "utf8" | "utf-8"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('utf8')
      .toEqualTypeOf<'utf8' | 'utf-8'>()
  })
})
