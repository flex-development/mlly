/**
 * @file Internal - validateArraySet
 * @module mlly/internal/validateArraySet
 */

import { ERR_INVALID_ARG_TYPE, type NodeError } from '@flex-development/errnode'

/**
 * Checks if given `value` is an array or a {@linkcode Set}.
 *
 * Throws [`ERR_INVALID_ARG_TYPE`][1] if the `value` is of neither type.
 *
 * [1]: https://nodejs.org/api/errors.html#err_invalid_arg_value
 *
 * @see {@linkcode ERR_INVALID_ARG_TYPE}
 *
 * @template T - Item type(s)
 *
 * @param {unknown} value - Value supplied by user
 * @param {string} name - Name of invalid argument or property
 * @return {value is Set<T> | T[]} `true` if `value` is array or {@linkcode Set}
 * @throws {NodeError<TypeError>} If `value` is not an array or {@linkcode Set}
 */
function validateArraySet<T = unknown>(
  value: unknown,
  name: string
): value is Set<T> | T[] {
  if (Array.isArray(value) || value instanceof Set) return true
  throw new ERR_INVALID_ARG_TYPE(name, ['Array', 'Set'], value)
}

export default validateArraySet
