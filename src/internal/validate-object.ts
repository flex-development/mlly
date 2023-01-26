/**
 * @file Internal - validateObject
 * @module mlly/internal/validateObject
 */

import { ERR_INVALID_ARG_TYPE, type NodeError } from '@flex-development/errnode'
import type { ObjectPlain } from '@flex-development/tutils'

/**
 * Checks if given `value` is an object.
 *
 * **Note**: Array values are not considered objects.
 *
 * Throws [`ERR_INVALID_ARG_TYPE`][1] if the `value` is not an object.
 *
 * [1]: https://nodejs.org/api/errors.html#err_invalid_arg_value
 *
 * @see {@linkcode ERR_INVALID_ARG_TYPE}
 *
 * @param {unknown} value - Value supplied by user
 * @param {string} name - Name of invalid argument or property
 * @return {value is ObjectPlain} `true` if `value` is an object
 * @throws {NodeError<TypeError>} If `value` is not an object
 */
const validateObject = (value: unknown, name: string): value is ObjectPlain => {
  if (typeof value === 'object' && value && !Array.isArray(value)) return true
  throw new ERR_INVALID_ARG_TYPE(name, 'object', value)
}

export default validateObject
