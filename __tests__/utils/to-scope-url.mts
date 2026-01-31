/**
 * @file Test Utilities - toScopeUrl
 * @module tests/utils/toScopeUrl
 */

import pathe from '@flex-development/pathe'

/**
 * Create a package directory URL.
 *
 * @param {string} name
 *  The package name
 * @return {URL}
 *  The package directory URL
 */
function toScopeUrl(name: string): URL {
  return pathe.pathToFileURL(`__fixtures__/node_modules/${name}/`)
}

export default toScopeUrl
