/**
 * @file Mocks - tsconfig-paths
 * @module mocks/tsconfig-paths
 * @see https://github.com/dividab/tsconfig-paths
 */

/**
 * [`tsconfig-paths`][1] module type.
 *
 * [1]: https://github.com/dividab/tsconfig-paths
 */
type Actual = typeof import('tsconfig-paths')

/**
 * `tsconfig-paths` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('tsconfig-paths')

export const createMatchPath = vi.fn(actual.createMatchPath)
