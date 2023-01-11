/**
 * @file CONDITIONS
 * @module mlly/utils/CONDITIONS
 */

/**
 * Default export conditions.
 *
 * @see https://nodejs.org/api/packages.html#conditional-exports
 *
 * @const {Readonly<Set<string>>} CONDITIONS
 */
const CONDITIONS: Readonly<Set<string>> = Object.freeze(
  new Set(['node', 'import'])
)

export default CONDITIONS
