/**
 * @file Mock Utilities - findRequires
 * @module mlly/utils/mocks/findRequires
 */

/**
 * `findRequires` module type.
 */
type Actual = typeof import('../find-requires')

/**
 * `findRequires` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../find-requires')

export default vi.fn(actual.default)
