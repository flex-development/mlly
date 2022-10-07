/**
 * @file isBuiltin
 * @module mlly/lib/isBuiltin
 */

import { builtinModules } from 'node:module'

/**
 * Checks if `name` is a [builtin module][1].
 *
 * [1]: https://nodejs.org/api/esm.html#builtin-modules
 *
 * @example
 *  isBuiltin('@flex-development/mlly') // false
 * @example
 *  isBuiltin('node:fs') // true
 * @example
 *  isBuiltin('fs') // true
 *
 * @param {string} name - Module name to check
 * @return {boolean} `true` if `name` is builtin module, `false` otherwise
 */
const isBuiltin = (name: string): boolean => {
  return builtinModules.flatMap(m => [m, 'node:' + m]).includes(name)
}

export default isBuiltin
