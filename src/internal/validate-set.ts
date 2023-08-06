/**
 * @file Internal - validateSet
 * @module mlly/internal/validateSet
 */

import { ERR_INVALID_ARG_TYPE, type NodeError } from '@flex-development/errnode'
import { isSet } from '@flex-development/tutils'

/**
 * Checks if given `value` is a {@linkcode Set}.
 *
 * Throws [`ERR_INVALID_ARG_TYPE`][1] if `value` is not a {@linkcode Set}.
 *
 * [1]: https://nodejs.org/api/errors.html#err_invalid_arg_value
 *
 * @see {@linkcode ERR_INVALID_ARG_TYPE}
 *
 * @internal
 *
 * @template T - Set item type
 *
 * @param {unknown} value - Value supplied by user
 * @param {string} name - Name of invalid argument or property
 * @return {value is Set<T>} `true` if `value` is a `Set`
 * @throws {NodeError<TypeError>} If `value` is not a `Set`
 */
const validateSet = <T>(value: unknown, name: string): value is Set<T> => {
  if (isSet<T>(value)) return true
  throw new ERR_INVALID_ARG_TYPE(name, ['Set'], value)
}

export default validateSet
