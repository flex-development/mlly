/**
 * @file Internal - validateMap
 * @module mlly/internal/validateMap
 */

import { ERR_INVALID_ARG_TYPE, type NodeError } from '@flex-development/errnode'
import { isMap, type PropertyKey } from '@flex-development/tutils'

/**
 * Checks if `value` is a {@linkcode Map} instance.
 *
 * Throws [`ERR_INVALID_ARG_TYPE`][1] if `value` is not a {@linkcode Map}.
 *
 * [1]: https://nodejs.org/api/errors.html#err_invalid_arg_value
 *
 * @see {@linkcode ERR_INVALID_ARG_TYPE}
 *
 * @internal
 *
 * @template K - Map key type
 * @template V - Map item type
 *
 * @param {unknown} value - Value supplied by user
 * @param {string} name - Name of invalid argument or property
 * @return {value is Map<K, V>} `true` if `value` is a `Map`
 * @throws {NodeError<TypeError>} If `value` is not a `Map`
 */
const validateMap = <K = PropertyKey, V = unknown>(
  value: unknown,
  name: string
): value is Map<K, V> => {
  if (isMap<K, V>(value)) return true
  throw new ERR_INVALID_ARG_TYPE(name, ['Map'], value)
}

export default validateMap
