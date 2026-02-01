/**
 * @file Type Aliases - PatternKeyComparison
 * @module mlly/types/PatternKeyComparison
 */

import type { PatternKeyComparisonMap } from '@flex-development/mlly'

/**
 * Union of values that can occur
 * where a `PATTERN_KEY_COMPARE` algorithm result is expected.
 *
 * To register new results, augment {@linkcode PatternKeyComparisonMap}.
 * They will be added to this union automatically.
 */
type PatternKeyComparison =
  PatternKeyComparisonMap[keyof PatternKeyComparisonMap]

export type { PatternKeyComparison as default }
