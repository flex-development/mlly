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
   * The file system API.
   *
   * @see {@linkcode FileSystem}
   *
   * @override
   */
  fs: FileSystem

  /**
   * Record, where each key is a URL protocol
   * and each value is a source code handler.
   *
   * @see {@linkcode GetSourceHandlers}
   *
   * @override
   */
  handlers: GetSourceHandlers

  /**
   * Request options for network based modules.
   *
   * @override
   */
  req: RequestInit

  /**
   * The list of supported URL schemes.
   *
   * @override
   */
  schemes: Set<string>
}

export type { GetSourceContext as default }
