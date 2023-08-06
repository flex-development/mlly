/**
 * @file Internal - validateArraySet
 * @module mlly/internal/validateArraySet
 */

import { ERR_INVALID_ARG_TYPE, type NodeError } from '@flex-development/errnode'
import { isArray, isSet } from '@flex-development/tutils'

/**
 * Checks if `value` is an array or an instance of {@linkcode Set}.
 *
 * Throws [`ERR_INVALID_ARG_TYPE`][1] if the `value` is of neither type.
 *
 * [1]: https://nodejs.org/api/errors.html#err_invalid_arg_value
 *
 * @see {@linkcode ERR_INVALID_ARG_TYPE}
 *
 * @internal
 *
 * @template T - Item type
 *
 * @param {unknown} value - Value supplied by user
 * @param {string} name - Name of invalid argument or property
 * @return {value is Set<T> | T[]} `true` if `value` is array or `Set`
 * @throws {NodeError<TypeError>} If `value` is not an array or `Set`
 */
const validateArraySet = <T>(
  value: unknown,
  name: string
): value is Set<T> | T[] => {
  if (isArray<T>(value) || isSet<T>(value)) return true
  throw new ERR_INVALID_ARG_TYPE(name, ['Array', 'Set'], value)
}

export default validateArraySet
