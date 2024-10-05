/**
 * @file cwd
 * @module mlly/lib/cwd
 */

import pathe from '@flex-development/pathe'

/**
 * Get the URL of the current working directory.
 *
 * @return {URL}
 *  URL of current working directory
 */
function cwd(): URL {
  return pathe.pathToFileURL(pathe.cwd() + pathe.sep)
}

export default cwd
