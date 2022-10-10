/**
 * @file Mocks - node-package-exports
 * @module mocks/node-package-exports
 * @see https://github.com/imtaotao/node-package-exports
 */

/**
 * [`node-package-exports`][1] module type.
 *
 * [1]: https://github.com/imtaotao/node-package-exports
 */
type Actual = typeof import('node-package-exports')

/**
 * `node-package-exports` module.
 *
 * @const {Actual} actual
 */
const actual: Actual = await vi.importActual<Actual>('node-package-exports')

export const findEntryInExports = vi.fn(actual.findEntryInExports)
export const findPathInExports = vi.fn(actual.findPathInExports)
export const parseModuleId = vi.fn(actual.parseModuleId)
