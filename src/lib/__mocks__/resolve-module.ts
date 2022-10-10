/**
 * @file Mock Library - resolveModule
 * @module mlly/lib/mocks/resolveModule
 */

/**
 * `resolveModule` module type.
 */
type Actual = typeof import('../resolve-module')

/**
 * `resolveModule` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../resolve-module')

export default vi.fn(actual.default)
