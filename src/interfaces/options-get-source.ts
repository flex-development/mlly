/**
 * @file Interfaces - GetSourceOptions
 * @module mlly/interfaces/GetSourceOptions
 */

import type { Format } from '#src/enums'
import type { Optional, OrLowercase } from '@flex-development/tutils'

/**
 * Source code retrieval options.
 *
 * @see {@linkcode Format}
 * @see {@linkcode RequestInit}
 */
interface GetSourceOptions {
  /**
   * Enable support for network based modules.
   *
   * **Note**: Requires [`node-fetch`][1].
   *
   * [1]: https://github.com/node-fetch/node-fetch
   *
   * @see https://nodejs.org/docs/latest-v16.x/api/esm.html#https-and-http-imports
   *
   * @default false
   */
  experimental_network_imports?: Optional<boolean>

  /**
   * Module format hint.
   *
   * @see {@linkcode Format}
   *
   * @default undefined
   */
  format?: Optional<OrLowercase<Format>>

  /**
   * Ignore [`ERR_UNSUPPORTED_ESM_URL_SCHEME`][1] if thrown.
   *
   * [1]: https://nodejs.org/api/errors.html#err_unsupported_esm_url_scheme
   *
   * @default false
   */
  ignore_errors?: Optional<boolean>

  /**
   * Request options for network based modules.
   *
   * Only applicable if {@linkcode experimental_network_imports} is enabled.
   *
   * @see {@linkcode RequestInit}
   *
   * @default {}
   */
  req?: Optional<import('node-fetch').RequestInit>
}

export type { GetSourceOptions as default }
