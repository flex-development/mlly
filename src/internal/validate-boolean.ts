/**
 * @file Internal - validateBoolean
 * @module mlly/internal/validateBoolean
 */

import { ERR_INVALID_ARG_TYPE, type NodeError } from '@flex-development/errnode'
import { isBoolean } from '@flex-development/tutils'

/**
 * Checks if `value` is a boolean.
 *
 * Throws [`ERR_INVALID_ARG_TYPE`][1] if `value` is not a boolean.
 *
 * [1]: https://nodejs.org/api/errors.html#err_invalid_arg_value
 *
 * @see {@linkcode ERR_INVALID_ARG_TYPE}
 *
 * @internal
 *
 * @param {unknown} value - Value supplied by user
 * @param {string} name - Name of invalid argument or property
 * @return {value is boolean} `true` if `value` is a boolean
 * @throws {NodeError<TypeError>} If `value` is not a boolean
 */
const validateBoolean = (value: unknown, name: string): value is boolean => {
  if (isBoolean(value)) return true
  throw new ERR_INVALID_ARG_TYPE(name, 'boolean', value)
}

export default validateBoolean
