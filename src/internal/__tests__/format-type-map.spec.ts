/**
 * @file Unit Tests - FORMAT_TYPE_MAP
 * @module mlly/internal/tests/unit/FORMAT_TYPE_MAP
 */

import { AssertType, Format } from '#src/enums'
import TEST_SUBJECT from '../format-type-map'

describe('unit:internal/FORMAT_TYPE_MAP', () => {
  it('should map Format.BUILTIN to AssertType.IMPLICIT', () => {
    expect(TEST_SUBJECT.get(Format.BUILTIN)).equal(AssertType.IMPLICIT)
  })

  it('should map Format.COMMONJS to AssertType.IMPLICIT', () => {
    expect(TEST_SUBJECT.get(Format.COMMONJS)).equal(AssertType.IMPLICIT)
  })

  it('should map Format.JSON to AssertType.JSON', () => {
    expect(TEST_SUBJECT.get(Format.JSON)).equal(AssertType.JSON)
  })

  it('should map Format.MODULE to AssertType.IMPLICIT', () => {
    expect(TEST_SUBJECT.get(Format.MODULE)).equal(AssertType.IMPLICIT)
  })

  it('should map Format.WASM to AssertType.IMPLICIT', () => {
    expect(TEST_SUBJECT.get(Format.WASM)).equal(AssertType.IMPLICIT)
  })
})
