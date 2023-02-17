/**
 * @file Internal - validateMap
 * @module mlly/internal/validateMap
 */

import { ERR_INVALID_ARG_TYPE, type NodeError } from '@flex-development/errnode'

/**
 * Checks if given `value` is a {@linkcode Map}.
 *
 * Throws [`ERR_INVALID_ARG_TYPE`][1] if the `value` is not a {@linkcode Map}.
 *
 * [1]: https://nodejs.org/api/errors.html#err_invalid_arg_value
 *
 * @see {@linkcode ERR_INVALID_ARG_TYPE}
 *
 * @template K - Map key type(s)
 * @template V - Item type(s)
 *
 * @param {unknown} value - Value supplied by user
 * @param {string} name - Name of invalid argument or property
 * @return {value is Map<K, V>} `true` if `value` is a {@linkcode Map}
 * @throws {NodeError<TypeError>} If `value` is not a {@linkcode Map}
 */
function validateMap<K extends string = string, V = unknown>(
  value: unknown,
  name: string
): value is Map<K, V> {
  if (value instanceof Map) return true
  throw new ERR_INVALID_ARG_TYPE(name, ['Map'], value)
}

export default validateMap
