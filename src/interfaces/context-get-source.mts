/**
 * @file Interfaces - GetSourceContext
 * @module mlly/interfaces/GetSourceContext
 */

import type {
  FileSystem,
  GetSourceHandlers,
  GetSourceOptions
} from '@flex-development/mlly'

/**
 * Source code retrieval context.
 *
 * @see {@linkcode GetSourceOptions}
 *
 * @extends {GetSourceOptions}
 */
interface GetSourceContext extends GetSourceOptions {
  /**
   * Throw [`ERR_UNSUPPORTED_ESM_URL_SCHEME`][err]?
   *
   * [err]: https://nodejs.org/api/errors.html#err_unsupported_esm_url_scheme
   */
  error: boolean

  /**
   * File system API.
   *
   * @see {@linkcode FileSystem}
   *
   * @override
   */
  fs: FileSystem

  /**
   * URL handler map.
   *
   * @see {@linkcode GetSourceHandlers}
   *
   * @override
   */
  handlers: GetSourceHandlers

  /**
   * Request options for network based modules.
   *
   * > 👉 **Note**: Only applicable if {@linkcode network} is
   * > enabled.
   *
   * @override
   */
  req: RequestInit

  /**
   * List of supported URL schemes.
   *
   * @override
   */
  schemes: Set<string>
}

export type { GetSourceContext as default }
