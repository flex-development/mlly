/**
 * @file Internal - validateString
 * @module mlly/internal/validateString
 */

import { ERR_INVALID_ARG_TYPE, type NodeError } from '@flex-development/errnode'

/**
 * Checks if `value` is a string.
 *
 * Throws [`ERR_INVALID_ARG_TYPE`][1] if `value` is not a string.
 *
 * [1]: https://nodejs.org/api/errors.html#err_invalid_arg_value
 *
 * @see {@linkcode ERR_INVALID_ARG_TYPE}
 *
 * @param {unknown} value - Value supplied by user
 * @param {string} name - Name of invalid argument or property
 * @return {value is string} `true` if `value` is a string
 * @throws {NodeError<TypeError>} If `value` is not a string
 */
const validateString = (value: unknown, name: string): value is string => {
  if (typeof value === 'string') return true
  throw new ERR_INVALID_ARG_TYPE(name, 'string', value)
}

export default validateString
