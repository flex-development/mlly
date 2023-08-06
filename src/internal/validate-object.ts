/**
 * @file Internal - validateObject
 * @module mlly/internal/validateObject
 */

import { ERR_INVALID_ARG_TYPE, type NodeError } from '@flex-development/errnode'
import { isObjectCurly, type ObjectCurly } from '@flex-development/tutils'

/**
 * Checks if `value` is a curly-braced object.
 *
 * Throws [`ERR_INVALID_ARG_TYPE`][1] if `value` is not a curly-braced object.
 *
 * [1]: https://nodejs.org/api/errors.html#err_invalid_arg_value
 *
 * @see {@linkcode isObjectCurly}
 *
 * @internal
 *
 * @param {unknown} value - Value supplied by user
 * @param {string} name - Name of invalid argument or property
 * @return {value is ObjectCurly} `true` if `value` is a curly-braced object
 * @throws {NodeError<TypeError>} If `value` is not a curly-braced object
 */
const validateObject = (value: unknown, name: string): value is ObjectCurly => {
  if (isObjectCurly(value)) return true
  throw new ERR_INVALID_ARG_TYPE(name, 'object', value)
}

export default validateObject
