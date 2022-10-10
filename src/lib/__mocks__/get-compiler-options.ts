/**
 * @file Mock Library - getCompilerOptions
 * @module mlly/lib/mocks/getCompilerOptions
 */

/**
 * `getCompilerOptions` module type.
 */
type Actual = typeof import('../get-compiler-options')

/**
 * `getCompilerOptions` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../get-compiler-options')

export default vi.fn(actual.default)
