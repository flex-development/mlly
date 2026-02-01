/**
 * @file isModuleId
 * @module mlly/lib/isModuleId
 */

import type { ModuleId } from '@flex-development/mlly'

/**
 * Check if `value` is a module id.
 *
 * ::: warning
 * Does **not** guarantee `value` references an existing file or directory.
 * :::
 *
 * @see {@linkcode ModuleId}
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to check
 * @return {value is ModuleId}
 *  `true` if `value` is module id, `false` otherwise
 */
function isModuleId(this: void, value: unknown): value is ModuleId {
  return typeof value === 'string' || value instanceof URL
}

export default isModuleId
