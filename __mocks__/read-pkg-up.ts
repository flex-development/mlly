/**
 * @file Mocks - read-pkg-up
 * @module mocks/read-pkg-up
 * @see https://github.com/sindresorhus/read-pkg-up
 */

/**
 * [`read-pkg-up`][1] module type.
 *
 * [1]: https://github.com/sindresorhus/read-pkg-up
 */
type Actual = typeof import('read-pkg-up')

/**
 * `read-pkg-up` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('read-pkg-up')

export const readPackageUp = vi.fn(actual.readPackageUp)
