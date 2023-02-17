/**
 * @file Internal - validateSet
 * @module mlly/internal/validateSet
 */

import { ERR_INVALID_ARG_TYPE, type NodeError } from '@flex-development/errnode'

/**
 * Checks if given `value` is a {@linkcode Set}.
 *
 * Throws [`ERR_INVALID_ARG_TYPE`][1] if the `value` is not a {@linkcode Set}.
 *
 * [1]: https://nodejs.org/api/errors.html#err_invalid_arg_value
 *
 * @see {@linkcode ERR_INVALID_ARG_TYPE}
 *
 * @template T - Item type(s)
 *
 * @param {unknown} value - Value supplied by user
 * @param {string} name - Name of invalid argument or property
 * @return {value is Set<T>} `true` if `value` is a {@linkcode Set}
 * @throws {NodeError<TypeError>} If `value` is not a {@linkcode Set}
 */
function validateSet<T = unknown>(
  value: unknown,
  name: string
): value is Set<T> {
  if (value instanceof Set) return true
  throw new ERR_INVALID_ARG_TYPE(name, ['Set'], value)
}

export default validateSet
