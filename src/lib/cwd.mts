/**
 * @file cwd
 * @module mlly/lib/cwd
 */

import pathe from '@flex-development/pathe'

/**
 * Get the URL of the current working directory.
 *
 * @this {void}
 *
 * @return {URL}
 *  The current working directory URL
 */
function cwd(this: void): URL {
  return pathe.pathToFileURL(pathe.cwd() + pathe.sep)
}

export default cwd
