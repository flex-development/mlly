/**
 * @file Test Utilities - toPackageUrl
 * @module tests/utils/toPackageUrl
 */

import pathe from '@flex-development/pathe'

/**
 * Create a package directory URL.
 *
 * @param {string} name
 *  Package name
 * @return {URL}
 *  Package directory URL
 */
function toPackageUrl(name: string): URL {
  return pathe.pathToFileURL(`__fixtures__/node_modules/${name}/`)
}

export default toPackageUrl
