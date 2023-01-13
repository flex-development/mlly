/**
 * @file toURL
 * @module mlly/utils/toURL
 */

import validateURLString from '#src/internal/validate-url-string'
import type { ModuleId } from '#src/types'
import type { NodeError } from '@flex-development/errnode'
import { URL, pathToFileURL } from 'node:url'

/**
 * Converts the given module `id` to an instance of [`URL`][1].
 *
 * [1]: https://nodejs.org/api/url.html#class-url
 *
 * @see {@linkcode ModuleId}
 *
 * @param {ModuleId} id - Module id to evaluate
 * @param {ModuleId?} [base=pathToFileURL('./')] - Base URL to resolve against
 * if `id` is not absolute
 * @return {URL} `id` as instance of `URL`
 * @throws {NodeError<TypeError>} If either `id` or `base` is not a string or an
 * instance of `URL`
 */
const toURL = (id: ModuleId, base: ModuleId = pathToFileURL('./')): URL => {
  validateURLString(id, 'id')
  validateURLString(base, 'base')
  return id instanceof URL ? id : new URL(id, base)
}

export default toURL
