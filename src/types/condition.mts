/**
 * @file Type Aliases - Condition
 * @module mlly/types/Condition
 */

import type { ConditionMap } from '@flex-development/mlly'

/**
 * Union of values that can occur where a export/import condition is expected.
 *
 * To register new conditions, augment {@linkcode ConditionMap}.
 * They will be added to this union automatically.
 */
type Condition = ConditionMap[keyof ConditionMap]

export type { Condition as default }
