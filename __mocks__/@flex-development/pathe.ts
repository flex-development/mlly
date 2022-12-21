/**
 * @file Mocks - @flex-development/pathe
 * @module mocks/flex-development/pathe
 * @see https://github.com/flex-development/pathe
 */

/**
 * [`@flex-development/pathe`][1] module type.
 *
 * [1]: https://github.com/flex-development/pathe
 */
type Actual = typeof import('@flex-development/pathe')

/**
 * `@flex-development/pathe` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('@flex-development/pathe')

export default {
  basename: vi.fn(actual.basename),
  changeExt: vi.fn(actual.changeExt),
  dirname: vi.fn(actual.dirname),
  extname: vi.fn(actual.extname),
  format: vi.fn(actual.format),
  isAbsolute: vi.fn(actual.isAbsolute),
  join: vi.fn(actual.join),
  parse: vi.fn(actual.parse),
  relative: vi.fn(actual.relative),
  removeExt: vi.fn(actual.removeExt),
  resolve: vi.fn(actual.resolve)
}
