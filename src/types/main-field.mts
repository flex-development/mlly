/**
 * @file Type Aliases - MainField
 * @module mlly/types/MainField
 */

import type { MainFieldMap } from '@flex-development/mlly'

/**
 * Union of values that can occur where a main field is expected.
 *
 * To register new fields, augment {@linkcode MainFieldMap}. They will be added
 * to this union automatically.
 */
type MainField = MainFieldMap[keyof MainFieldMap]

export type { MainField as default }
