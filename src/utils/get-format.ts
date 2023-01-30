/**
 * @file getFormat
 * @module mlly/utils/getFormat
 */

import { Format } from '#src/enums'
import type { GetFormatOptions, PackageScope } from '#src/interfaces'
import type { ModuleId } from '#src/types'
import {
  ERR_UNKNOWN_FILE_EXTENSION,
  type NodeError
} from '@flex-development/errnode'
import { isBuiltin } from '@flex-development/is-builtin'
import pathe, { type Ext } from '@flex-development/pathe'
import type { EmptyString, Nilable, Nullable } from '@flex-development/tutils'
import type { URL } from 'node:url'
import EXTENSION_FORMAT_MAP from './extension-format-map'
import lookupPackageScope from './lookup-package-scope'
import parseDataURL from './parse-data-url'
import toURL from './to-url'

/**
 * Retrieves a module format for the given module `id`.
 *
 * @see {@linkcode Format}
 * @see {@linkcode GetFormatOptions}
 * @see {@linkcode ModuleId}
 *
 * @async
 *
 * @param {ModuleId} id - Module id to evaluate
 * @param {GetFormatOptions?} [options={}] - Format retrieval options
 * @return {Promise<Nilable<Format>>} Module format, `null`, or `undefined`
 * @throws {NodeError<TypeError>}
 */
const getFormat = async (
  id: ModuleId,
  options: GetFormatOptions = {}
): Promise<Nilable<Format>> => {
  const {
    base,
    experimental_json_modules = true,
    experimental_network_imports = false,
    experimental_wasm_modules = false,
    extension_format_map = EXTENSION_FORMAT_MAP,
    ignore_errors = false,
    req
  } = options

  /**
   * Module {@linkcode id} as {@linkcode URL}.
   *
   * @const {URL} url
   */
  const url: URL = toURL(id, base)

  /**
   * Extracts a [MIME type][1] from a {@linkcode URL} href, {@linkcode URL}
   * pathname, or [`Content-Type`][2] header and converts it to a module format.
   *
   * [1]: https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types
   * [2]: https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Type
   *
   * @param {Nullable<string>} value - `URL` component or `content-type` header
   * @param {boolean} [content_type=false] - `value` is `content-type` header?
   * @return {Nilable<Format>} Module format, `null`, or `undefined`
   */
  const mimeToFormat = (
    value: Nullable<string>,
    content_type: boolean = false
  ): Nilable<Format> => {
    /**
     * Module format for {@linkcode value}.
     *
     * @var {Nilable<Format>} format
     */
    let format: Nilable<Format> = null

    // do nothing if value is empty
    /* c8 ignore next */ if (!value) return format

    // sanitize content-type header
    if (content_type) value = value.replace(/;.*/, ',')

    // add data: protocol to value
    if (!value.startsWith('data:')) value = `data:${value}`

    // get format based on mime type
    try {
      switch (parseDataURL(value).mime) {
        case 'application/javascript':
        case 'application/typescript':
        case 'text/javascript':
          format = Format.MODULE
          break
        case 'application/json':
          format = experimental_json_modules ? Format.JSON : null
          break
        case 'application/wasm':
          format = experimental_wasm_modules ? Format.WASM : null
          break
        default:
          break
      }
    } catch {
      format = ignore_errors ? undefined : null
    }

    return format
  }

  /**
   * Module format for {@linkcode id}.
   *
   * @var {Nilable<Format>} format
   */
  let format: Nilable<Format> = null

  // get format based on url protocol
  switch (url.protocol) {
    case 'data:':
      format = mimeToFormat(url.href)
      break
    case 'file:':
      /**
       * File extension of {@linkcode url.pathname}.
       *
       * @const {EmptyString | Ext}
       */
      const ext: EmptyString | Ext = pathe.extname(url.pathname)

      /**
       * Package scope result for {@linkcode url}.
       *
       * @const {Nullable<PackageScope>} scope
       */
      const scope: Nullable<PackageScope> = lookupPackageScope(url)

      switch (true) {
        // get format based on package type
        case scope && ext === '.js':
          format =
            scope!.pkgjson.type === Format.MODULE
              ? Format.MODULE
              : Format.COMMONJS
          break
        // get format based on file extension
        case extension_format_map.has(ext):
          format = extension_format_map.get(ext)!

          switch (true) {
            case format === Format.JSON && !experimental_json_modules:
            case format === Format.WASM && !experimental_wasm_modules:
              format = ignore_errors ? undefined : null
              break
            default:
              break
          }

          break
        // ignore file extension errors
        case ignore_errors:
          format = undefined
          break
        default:
          /**
           * Recommended fix for [`ERR_UNKNOWN_FILE_EXTENSION`][1].
           *
           * [1]: https://nodejs.org/api/errors.html#err_unknown_file_extension
           *
           * @var {string?} suggestion
           */
          let suggestion: string | undefined

          // add recommended fix for ERR_UNKNOWN_FILE_EXTENSION if package is
          // esm-only and module id does not include file extension
          if (scope && scope.pkgjson.type === Format.MODULE && ext === '') {
            const { pkg } = scope

            /**
             * Basename of {@linkcode url.pathname}
             *
             * @const {string} basename
             */
            const basename: string = pathe.basename(url.pathname)

            /**
             * Relative path from {@linkcode pkg} to {@linkcode url.pathname}.
             *
             * @const {string} relative
             */
            const relative: string = pathe.relative(pkg, url.pathname).slice(1)

            suggestion = `Loading extensionless files is not supported inside of "type":"module" package.json contexts. The package.json file ${pkg} caused this "type":"module" context. Try changing ${url.pathname} to have a file extension. Note the "bin" field of package.json can point to a file with an extension, for example {"type":"module","bin":{"${basename}":"${relative}.js"}}`
          }

          throw new ERR_UNKNOWN_FILE_EXTENSION(ext, url.pathname, suggestion)
      }

      break
    case 'http:':
    case 'https:':
      if (experimental_network_imports) {
        const { default: fetch } = await import('node-fetch')
        const { headers } = await fetch(url.href, req)
        format = mimeToFormat(headers.get('content-type'), true)
      } else {
        format = ignore_errors ? undefined : null
      }

      break
    case 'node:':
      if (isBuiltin(url)) format = Format.BUILTIN
      break
    default:
      break
  }

  return format
}

export default getFormat
