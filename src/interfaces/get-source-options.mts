/**
 * @file Interfaces - GetSourceOptions
 * @module mlly/interfaces/GetSourceOptions
 */

import type {
  BufferEncoding,
  FileSystem,
  GetSourceHandlers,
  List,
  ModuleFormat
} from '@flex-development/mlly'

/**
 * Options for retrieving source code.
 */
interface GetSourceOptions {
  /**
   * The encoding of the result.
   *
   * > 👉 **Note**: Used when the `file:` handler is called.
   *
   * @see {@linkcode BufferEncoding}
   */
  encoding?: BufferEncoding | null | undefined

  /**
   * The module format hint.
   *
   * @see {@linkcode ModuleFormat}
   */
  format?: ModuleFormat | null | undefined

  /**
   * The file system API.
   *
   * @see {@linkcode FileSystem}
   */
  fs?: FileSystem | null | undefined

  /**
   * Record, where each key is a URL protocol
   * and each value is a source code handler.
   *
   * @see {@linkcode GetSourceHandlers}
   */
  handlers?: GetSourceHandlers | null | undefined

  /**
   * Whether to ignore [`ERR_UNSUPPORTED_ESM_URL_SCHEME`][err] if thrown.
   *
   * [err]: https://nodejs.org/api/errors.html#err_unsupported_esm_url_scheme
   */
  ignoreErrors?: boolean | null | undefined

  /**
   * Request options for network based modules.
   */
  req?: RequestInit | null | undefined

  /**
   * The list of supported URL schemes.
   *
   * @see {@linkcode List}
   *
   * @default ['data','file','http','https','node']
   */
  schemes?: List<string> | null | undefined
}

export type { GetSourceOptions as default }
