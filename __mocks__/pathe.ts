/**
 * @file Mocks - pathe
 * @module mocks/pathe
 * @see https://github.com/unjs/pathe
 */

/**
 * [`pathe`][1] module type.
 *
 * [1]: https://github.com/unjs/pathe
 */
type Actual = typeof import('pathe')

/**
 * `pathe` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('pathe')

export const dirname = vi.fn(actual.dirname)
export const relative = vi.fn(actual.relative)
export const resolve = vi.fn(actual.resolve)
