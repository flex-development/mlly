/**
 * @file defaultConditions
 * @module mlly/lib/defaultConditions
 */

import type { Condition } from '@flex-development/mlly'

/**
 * The default list of conditions.
 *
 * @see {@linkcode Condition}
 * @see https://nodejs.org/api/packages.html#conditional-exports
 *
 * @const {Set<Condition>} defaultConditions
 */
const defaultConditions: Set<Condition> = new Set(['node', 'import'])

export default defaultConditions
