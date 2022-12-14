/**
 * @file Mock Utilities - resolveAlias
 * @module mlly/utils/mocks/resolveAlias
 */

/**
 * `resolveAlias` module type.
 */
type Actual = typeof import('../resolve-alias')

/**
 * `resolveAlias` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../resolve-alias')

export default vi.fn(actual.default)
