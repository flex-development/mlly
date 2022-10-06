/**
 * @file Mocks - tsconfig-paths/lib/tsconfig-loader
 * @module mocks/tsconfig-paths/lib/tsconfig-loader
 * @see https://github.com/dividab/tsconfig-paths
 */

/**
 * `tsconfig-paths/lib/tsconfig-loader` module type.
 */
type Actual = typeof import('tsconfig-paths/lib/tsconfig-loader')

/**
 * Mocked module path.
 *
 * @const {string} path
 */
const path: string = 'tsconfig-paths/lib/tsconfig-loader'

/**
 * `tsconfig-paths/lib/tsconfig-loader` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>(path)

export const loadTsconfig = vi.fn(actual.loadTsconfig)
