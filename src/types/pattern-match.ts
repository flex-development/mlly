/**
 * @file Type Aliases - PatternMatch
 * @module mlly/types/PatternMatch
 */

/**
 * List, where the first item is the key of a package `exports` or `imports`
 * target object, and the last is a subpath pattern match.
 */
type PatternMatch = [expansionKey: string, patternMatch: string | null]

export type { PatternMatch as default }
