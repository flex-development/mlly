/**
 * @file Fixtures - Path Aliases
 * @module fixtures/path-aliases
 */

import '#src/utils/extract-statements'

require('#src/utils/resolve-aliases')
require('./aggregate-error-ponyfill.cjs')

await import('#src/utils/detect-syntax')

export * from '#src/interfaces'
