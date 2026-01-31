/**
 * @file Test Utilities - toScopedUrl
 * @module tests/utils/toScopedUrl
 */

import toScopeUrl from '#tests/utils/to-scope-url'

/**
 * Create a URL in the scope of a package.
 *
 * @param {string} name
 *  The package name
 * @param {string} module
 *  The module path
 * @return {URL}
 *  The scoped URL
 */
function toScopedUrl(name: string, module: string): URL {
  return new URL(module, toScopeUrl(name))
}

export default toScopedUrl
