/**
 * @file getSource
 * @module mlly/utils/getSource
 */

import { Format } from '#src/enums'
import type { GetSourceOptions } from '#src/interfaces'
import validateBoolean from '#src/internal/validate-boolean'
import validateObject from '#src/internal/validate-object'
import validateString from '#src/internal/validate-string'
import type { ModuleId } from '#src/types'
import {
  ERR_UNSUPPORTED_ESM_URL_SCHEME,
  type NodeError
} from '@flex-development/errnode'
import { isUndefined, type Optional } from '@flex-development/tutils'
import fs from 'node:fs/promises'
import os from 'node:os'
import type { URL } from 'node:url'
import util from 'node:util'
import parseDataURL from './parse-data-url'
import toURL from './to-url'

/**
 * Retrieves source code for the given module `id`.
 *
 * ::: tip
 * The given module `id` should be absolute (i.e. a [`file:` URL][1] or absolute
 * specifier).
 * :::
 *
 * [1]: https://nodejs.org/api/esm.html#file-urls
 *
 * @see {@linkcode GetSourceOptions}
 * @see {@linkcode ModuleId}
 * @see https://nodejs.org/docs/latest-v19.x/api/esm.html#loadurl-context-nextload
 *
 * @async
 *
 * @param {ModuleId} id - Module id to evaluate
 * @param {GetSourceOptions?} [options={}] - Source code retrieval options
 * @return {Promise<Optional<Uint8Array | string>>} Source code for `id`
 * @throws {NodeError} If unsupported URL scheme is encountered
 */
const getSource = async (
  id: ModuleId,
  options: GetSourceOptions = {}
): Promise<Optional<Uint8Array | string>> => {
  const {
    experimental_network_imports: network_imports = false,
    format,
    ignore_errors = false,
    req = {}
  } = options

  validateBoolean(network_imports, 'options.experimental_network_imports')
  !isUndefined(format) && validateString(format, 'options.format')
  validateBoolean(ignore_errors, 'options.ignore_errors')
  validateObject(req, 'options.req')

  // exit early if format is Format.BUILTIN
  if (format === Format.BUILTIN) return undefined

  /**
   * Module {@linkcode id} as {@linkcode URL}.
   *
   * @const {URL} url
   */
  const url: URL = toURL(id)

  /**
   * [`ERR_UNSUPPORTED_ESM_URL_SCHEME`][1] check.
   *
   * [1]: https://nodejs.org/api/errors.html#err_unsupported_esm_url_scheme
   *
   * @var {boolean} err
   */
  let err: boolean = false

  /**
   * Source code for {@linkcode id}.
   *
   * @var {Optional<Uint8Array | string>} source
   */
  let source: Optional<Uint8Array | string> = ''

  // get source code based on url protocol
  switch (url.protocol) {
    case 'data:':
      const { base64, data } = parseDataURL(url)

      /**
       * Buffer encoding used to create a {@linkcode Buffer} instance from
       * {@linkcode data}.
       *
       * @const {BufferEncoding} encoding
       */
      const encoding: BufferEncoding = base64 ? 'base64' : 'utf8'

      source = Buffer.from(decodeURIComponent(data), encoding).toString()
      break
    case 'file:':
      source = await fs.readFile(url, 'utf8')
      break
    case 'http:':
    case 'https:':
      if (network_imports) {
        source = await (await fetch(url, req)).text()
      } else {
        err = true
      }

      break
    case 'node:':
      source = undefined
      break
    default:
      err = true
  }

  // throw if unsupported url scheme was encountered
  if (!ignore_errors && err) {
    /**
     * Supported URL schemes.
     *
     * @const {string[]} schemes
     */
    const schemes: string[] = ['data', 'file']

    // update supported schemes if support for network based modules is enabled
    if (network_imports) schemes.push('http', 'https')

    throw new ERR_UNSUPPORTED_ESM_URL_SCHEME(
      url,
      schemes,
      os.platform() === 'win32'
    )
  }

  return format === Format.WASM ? new util.TextEncoder().encode(source) : source
}

export default getSource
