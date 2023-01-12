/**
 * @file Internal - FORMAT_TYPE_MAP
 * @module mlly/internal/FORMAT_TYPE_MAP
 */

import { AssertType, Format } from '#src/enums'

/**
 * Module format to `import` assertion type map.
 *
 * **Note**:  It's unclear whether or not the HTML spec will require assertion
 * types for WebAssembly modules.
 *
 * @see https://github.com/WebAssembly/esm-integration/issues/42
 *
 * @const {Map<Format, AssertType>} FORMAT_TYPE_MAP
 */
const FORMAT_TYPE_MAP: Map<Format, AssertType> = new Map<Format, AssertType>([
  [Format.BUILTIN, AssertType.IMPLICIT],
  [Format.COMMONJS, AssertType.IMPLICIT],
  [Format.JSON, AssertType.JSON],
  [Format.MODULE, AssertType.IMPLICIT],
  [Format.WASM, AssertType.IMPLICIT]
])

export default FORMAT_TYPE_MAP
