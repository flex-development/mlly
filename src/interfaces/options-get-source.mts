/**
 * @file Interfaces - GetSourceOptions
 * @module mlly/interfaces/GetSourceOptions
 */

import type {
  FileSystem,
  GetSourceHandlers,
  ModuleFormat
} from '@flex-development/mlly'

/**
 * Source code retrieval options.
 */
interface GetSourceOptions {
  /**
   * Module format hint.
   *
   * @see {@linkcode ModuleFormat}
   */
  format?: ModuleFormat | null | undefined

  /**
   * File system API.
   *
   * @see {@linkcode FileSystem}
   */
  fs?: FileSystem | null | undefined

  /**
   * URL handler map.
   *
   * @see {@linkcode GetSourceHandlers}
   */
  handlers?: GetSourceHandlers | null | undefined

  /**
   * Ignore [`ERR_UNSUPPORTED_ESM_URL_SCHEME`][err] if thrown.
   *
   * [err]: https://nodejs.org/api/errors.html#err_unsupported_esm_url_scheme
   */
  ignoreErrors?: boolean | null | undefined

  /**
   * Request options for network based modules.
   *
   * > 👉 **Note**: Only applicable if {@linkcode network} is enabled.
   */
  req?: RequestInit | null | undefined

  /**
   * List of supported URL schemes.
   *
   * @default ['data','file','http','https','node']
   */
  schemes?: Set<string> | readonly string[] | null | undefined
}

export type { GetSourceOptions as default }
