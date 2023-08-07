/**
 * @file validateAssertions
 * @module mlly/utils/validateAssertions
 */

import { AssertType, type Format } from '#src/enums'
import type { ImportAssertions } from '#src/interfaces'
import FORMAT_TYPE_MAP from '#src/internal/format-type-map'
import validateObject from '#src/internal/validate-object'
import validateString from '#src/internal/validate-string'
import validateURLString from '#src/internal/validate-url-string'
import type { ModuleId } from '#src/types'
import {
  ERR_IMPORT_ASSERTION_TYPE_FAILED,
  ERR_IMPORT_ASSERTION_TYPE_MISSING,
  ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED,
  type NodeError
} from '@flex-development/errnode'
import {
  cast,
  hasOwn,
  includes,
  type LiteralUnion,
  type Optional
} from '@flex-development/tutils'
import { URL } from 'node:url'

/**
 * Test a module's `import` assertions.
 *
 * @see {@linkcode Format}
 * @see {@linkcode ImportAssertions}
 * @see {@linkcode ModuleId}
 *
 * @param {ModuleId} url - Module URL of imported module (for error reporting)
 * @param {LiteralUnion<Format, string>} format - Module format
 * @param {ImportAssertions} [assertions={}] - `import` assertions
 * @return {true} `true` if `assertions` are valid
 * @throws {NodeError<TypeError>}
 */
const validateAssertions = (
  url: ModuleId,
  format: LiteralUnion<Format, string>,
  assertions: ImportAssertions = {}
): true => {
  validateURLString(url, 'url')
  validateString(format, 'format')
  validateObject(assertions, 'assertions')

  // ensure url is a string
  if (url instanceof URL) url = url.href

  /**
   * `type` property check for {@linkcode assertions}.
   *
   * @const {boolean} has_type
   */
  const has_type: boolean = hasOwn(assertions, 'type')

  /**
   * `import` assertion type.
   *
   * @const {Optional<AssertType>} type
   */
  const type: Optional<AssertType> = FORMAT_TYPE_MAP.get(cast(format))

  /**
   * `import` assertion error check.
   *
   * @var {boolean} err
   */
  let err: boolean = false

  // validate import assertions
  switch (type) {
    case undefined:
      // ignore assertions for unrecognized module formats to allow for new
      // formats in the future
      break
    case AssertType.IMPLICIT:
      // format doesn't allow an import assertion type, so the `type` property
      // must not be set on the import assertions object
      if (has_type) err = true
      break
    case assertions.type:
      // asserted type is compatible with format
      break
    default:
      // format has an expected type, but asserted type is not compatible
      err = true
  }

  // throw if error was encountered
  if (err) {
    // import assertion type was not specified
    if (!has_type) throw new ERR_IMPORT_ASSERTION_TYPE_MISSING(url, type!)

    // import assertion type may have not been a string
    validateString(assertions.type, 'assertions.type')

    /**
     * Supported `import` assertion types.
     *
     * @const {AssertType[]} supported
     */
    const supported: AssertType[] = []

    // get supported import assertion types
    for (const [, type] of FORMAT_TYPE_MAP) {
      if (type === AssertType.IMPLICIT) continue
      supported.push(type)
    }

    // throw if asserted type is not supported
    if (!includes(supported, assertions.type)) {
      throw new ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED(assertions.type!)
    }

    // unknown error
    throw new ERR_IMPORT_ASSERTION_TYPE_FAILED(url, assertions.type!)
  }

  return true
}

export default validateAssertions
