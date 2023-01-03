/**
 * @file Mock Utilities - extractStatements
 * @module mlly/utils/mocks/extractStatements
 */

/**
 * `extractStatements` module type.
 */
type Actual = typeof import('../extract-statements')

/**
 * `extractStatements` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../extract-statements')

export default vi.fn(actual.default)
