/**
 * @file root
 * @module mlly/lib/root
 */

import { dot, parse, pathToFileURL, resolve } from '@flex-development/pathe'

/**
 * URL of file system root.
 *
 * @const {URL} root
 */
const root: URL = pathToFileURL(parse(resolve(dot)).root)

export default root
