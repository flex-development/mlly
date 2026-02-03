/**
 * @file Type Tests - BufferEncoding
 * @module mlly/types/tests/unit-d/BufferEncoding
 */

import type TestSubject from '#types/buffer-encoding'
import type { BufferEncodingMap } from '@flex-development/mlly'

describe('unit-d:types/BufferEncoding', () => {
  it('should equal BufferEncodingMap[keyof BufferEncodingMap]', () => {
    expectTypeOf<TestSubject>()
      .toEqualTypeOf<BufferEncodingMap[keyof BufferEncodingMap]>()
  })
})
