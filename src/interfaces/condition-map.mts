/**
 * @file Interfaces - ConditionMap
 * @module mlly/interfaces/ConditionMap
 */

import type * as pkgTypes from '@flex-development/pkg-types'

/**
 * Registry of export/import conditions.
 *
 * This interface can be augmented to register custom conditions.
 *
 * @see {@linkcode pkgTypes.ConditionMap}
 *
 * @example
 *  declare module '@flex-development/mlly' {
 *    interface ConditionMap {
 *      custom: 'custom'
 *    }
 *  }
 *
 * @extends {pkgTypes.ConditionMap}
 */
interface ConditionMap extends pkgTypes.ConditionMap {}

export type { ConditionMap as default }
