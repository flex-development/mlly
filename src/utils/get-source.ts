/**
 * @file getSource
 * @module mlly/utils/getSource
 */

import { Format } from '#src/enums'
import type { GetSourceOptions } from '#src/interfaces'
import type { ModuleId } from '#src/types'
import {
  ERR_UNSUPPORTED_ESM_URL_SCHEME,
  type NodeError
} from '@flex-development/errnode'
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
 * @return {Promise<Uint8Array | string | undefined>} Source code for `id`
 * @throws {NodeError} If unsupported URL scheme is encountered
 */
const getSource = async (
  id: ModuleId,
  options: GetSourceOptions = {}
): Promise<Uint8Array | string | undefined> => {
  const {
    experimental_network_imports = false,
    format,
    ignore_errors = false,
    req
  } = options

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
   * @var {Uint8Array | string | undefined} source
   */
  let source: Uint8Array | string | undefined = ''

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
      if (experimental_network_imports) {
        const { default: fetch } = await import('node-fetch')
        source = await (await fetch(url.href, req)).text()
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
    if (experimental_network_imports) schemes.push('http', 'https')

    throw new ERR_UNSUPPORTED_ESM_URL_SCHEME(
      url,
      schemes,
      os.platform() === 'win32'
    )
  }

  return format === Format.WASM ? new util.TextEncoder().encode(source) : source
}

export default getSource
