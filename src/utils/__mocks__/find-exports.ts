/**
 * @file Mock Utilities - findExports
 * @module mlly/utils/mocks/findExports
 */

/**
 * `findExports` module type.
 */
type Actual = typeof import('../find-exports')

/**
 * `findExports` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../find-exports')

export default vi.fn(actual.default)
