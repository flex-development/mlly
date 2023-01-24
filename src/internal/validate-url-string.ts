/**
 * @file Internal - validateURLString
 * @module mlly/internal/validateURLString
 */

import { ERR_INVALID_ARG_TYPE, type NodeError } from '@flex-development/errnode'
import { URL } from 'node:url'

/**
 * Checks if given `value` is an instance of {@linkcode URL} or a string.
 *
 * Throws [`ERR_INVALID_ARG_TYPE`][1] if the `value` is of neither type.
 *
 * [1]: https://nodejs.org/api/errors.html#err_invalid_arg_value
 *
 * @see {@linkcode ERR_INVALID_ARG_TYPE}
 *
 * @param {unknown} value - Value supplied by user
 * @param {string} name - Name of invalid argument or property
 * @return {value is URL | string} `true` if `value` is `URL` instance or string
 * @throws {NodeError<TypeError>} If `value` is not `URL` instance or string
 */
const validateURLString = (
  value: unknown,
  name: string
): value is URL | string => {
  if (value instanceof URL || typeof value === 'string') return true
  throw new ERR_INVALID_ARG_TYPE(name, ['URL', 'string'], value)
}

export default validateURLString
