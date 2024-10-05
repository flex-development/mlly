/**
 * @file Fixtures - invalidJsonUrl
 * @module fixtures/invalidJsonUrl
 */

import toPackageUrl from '#tests/utils/to-package-url'

/**
 * URL of mock package directory containing `package.json` file.
 *
 * @const {URL} invalidJsonUrl
 */
const invalidJsonUrl: URL = toPackageUrl('invalid-json')

export default invalidJsonUrl
