/**
 * @file Fixtures - Path Aliases
 * @module fixtures/path-aliases
 */

import '#src/lib/extract-statements'

require('#src/lib/resolve-aliases')
require('./aggregate-error-ponyfill.cjs')

await import('#src/lib/detect-syntax')

export * from '#src/constants'
export * from '#src/interfaces'
