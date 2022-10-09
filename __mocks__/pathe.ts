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

export const basename = vi.fn(actual.basename)
export const dirname = vi.fn(actual.dirname)
export const extname = vi.fn(actual.extname)
export const isAbsolute = vi.fn(actual.isAbsolute)
export const join = vi.fn(actual.join)
export const parse = vi.fn(actual.parse)
export const relative = vi.fn(actual.relative)
export const resolve = vi.fn(actual.resolve)
