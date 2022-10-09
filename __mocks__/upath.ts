/**
 * @file Mocks - upath
 * @module mocks/upath
 * @see https://github.com/anodynos/upath
 */

/**
 * [`upath`][1] module type.
 *
 * [1]: https://github.com/anodynos/upath
 */
type Actual = typeof import('upath')

/**
 * `upath` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('upath')

export default {
  basename: vi.fn(actual.basename),
  dirname: vi.fn(actual.dirname),
  extname: vi.fn(actual.extname),
  format: vi.fn(actual.format),
  isAbsolute: vi.fn(actual.isAbsolute),
  join: vi.fn(actual.join),
  parse: vi.fn(actual.parse),
  relative: vi.fn(actual.relative),
  resolve: vi.fn(actual.resolve)
}
