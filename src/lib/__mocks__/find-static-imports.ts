/**
 * @file Mock Library - findStaticImports
 * @module mlly/lib/mocks/findStaticImports
 */

/**
 * `findStaticImports` module type.
 */
type Actual = typeof import('../find-static-imports')

/**
 * `findStaticImports` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('../find-static-imports')

export default vi.fn(actual.default)
