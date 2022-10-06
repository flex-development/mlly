/**
 * @file Mock Utilities - findDynamicImports
 * @module mkbuild/utils/mocks/findDynamicImports
 */

/**
 * `findDynamicImports` module type.
 */
type Actual = typeof import('../find-dynamic-imports')

/**
 * `findDynamicImports` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../find-dynamic-imports')

export default vi.fn(actual.default)
