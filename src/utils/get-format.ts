/**
 * @file getFormat
 * @module mlly/utils/getFormat
 */

import { Format } from '#src/enums'
import type { GetFormatOptions, PackageScope } from '#src/interfaces'
import validateBoolean from '#src/internal/validate-boolean'
import validateMap from '#src/internal/validate-map'
import validateObject from '#src/internal/validate-object'
import type { ModuleId } from '#src/types'
import {
  ERR_UNKNOWN_FILE_EXTENSION,
  type NodeError
} from '@flex-development/errnode'
import { isBuiltin } from '@flex-development/is-builtin'
import pathe, { type Ext } from '@flex-development/pathe'
import {
  isEmptyString,
  type EmptyString,
  type Nilable,
  type Nullable,
  type Optional
} from '@flex-development/tutils'
import type { URL } from 'node:url'
import EXTENSION_FORMAT_MAP from './extension-format-map'
import lookupPackageScope from './lookup-package-scope'
import parseDataURL from './parse-data-url'
import toURL from './to-url'

/**
 * Retrieves a module format for the given module `id`.
 *
 * ::: tip
 * The given module `id` should be absolute (i.e. a [`file:` URL][1] or absolute
 * specifier).
 * :::
 *
 * [1]: https://nodejs.org/api/esm.html#file-urls
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
    experimental_json_modules: json_modules = true,
    experimental_network_imports: network_imports = false,
    experimental_wasm_modules: wasm_modules = false,
    extension_format_map = EXTENSION_FORMAT_MAP,
    ignore_errors = false,
    req = {}
  } = options

  validateBoolean(json_modules, 'options.experimental_json_modules')
  validateBoolean(network_imports, 'options.experimental_network_imports')
  validateBoolean(wasm_modules, 'options.experimental_wasm_modules')
  validateBoolean(ignore_errors, 'options.ignore_errors')
  validateMap(extension_format_map, 'options.extension_format_map')
  validateObject(req, 'options.req')

  /**
   * Extracts a [MIME type][1] from a {@linkcode URL} href, {@linkcode URL}
   * pathname, or [`Content-Type`][2] header and converts it to a module format.
   *
   * [1]: https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types
   * [2]: https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Type
   *
   * @param {Nullable<string>} value - `URL` component or `content-type` header
   * @param {boolean} [header=false] - `value` is `content-type` header?
   * @return {Nilable<Format>} Module format, `null`, or `undefined`
   */
  const mimeToFormat = (
    value: Nullable<string>,
    header: boolean = false
  ): Nilable<Format> => {
    /**
     * Module format for {@linkcode value}.
     *
     * @var {Nilable<Format>} format
     */
    let format: Nilable<Format> = null

    if (value) {
      // sanitize content-type header
      if (header) value = value.replace(/;.*/, ',')

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
            format = json_modules ? Format.JSON : null
            break
          case 'application/wasm':
            format = wasm_modules ? Format.WASM : null
            break
          default:
            break
        }
      } catch {
        format = ignore_errors ? undefined : null
      }
    }

    return format
  }

  /**
   * Module {@linkcode id} as {@linkcode URL}.
   *
   * @const {URL} url
   */
  const url: URL = toURL(id)

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
          format = scope.pkgjson.type === Format.MODULE
            ? Format.MODULE
            : Format.COMMONJS
          break
        // get format based on file extension
        case extension_format_map.has(ext):
          format = extension_format_map.get(ext)!

          switch (true) {
            case format === Format.JSON && !json_modules:
            case format === Format.WASM && !wasm_modules:
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
           * @var {Optional<string>} suggestion
           */
          let suggestion: Optional<string>

          // add recommended fix for ERR_UNKNOWN_FILE_EXTENSION if package is
          // esm-only and module id does not include file extension
          if (scope && scope.pkgjson.type === Format.MODULE) {
            if (isEmptyString(ext)) {
              /**
               * Basename of {@linkcode url.pathname}
               *
               * @const {string} basename
               */
              const basename: string = pathe.basename(url.pathname)

              /**
               * Relative path from `package.json` file to module id.
               *
               * @const {string} relative
               */
              const relative: string = pathe
                .relative(scope.pkg, url.pathname)
                .slice(1)

              suggestion =
                `Loading extensionless files is not supported inside of "type":"module" package.json contexts. The package.json file ${scope.pkg} caused this "type":"module" context. Try changing ${url.pathname} to have a file extension. Note the "bin" field of package.json can point to a file with an extension, for example {"type":"module","bin":{"${basename}":"${relative}.js"}}`
            }
          }

          throw new ERR_UNKNOWN_FILE_EXTENSION(ext, url.pathname, suggestion)
      }

      break
    case 'http:':
    case 'https:':
      if (network_imports) {
        const { headers } = await fetch(url, req)
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
