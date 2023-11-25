/**
 * @file Interfaces - GetFormatOptions
 * @module mlly/interfaces/GetFormatOptions
 */

import type { Format } from '#src/enums'
import type { Ext } from '@flex-development/pathe'
import type { EmptyString, Optional } from '@flex-development/tutils'

/**
 * Module format retrieval options.
 *
 * @see {@linkcode Ext}
 * @see {@linkcode Format}
 * @see {@linkcode RequestInit}
 */
interface GetFormatOptions {
  /**
   * Enable support for JSON modules.
   *
   * @see https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_json_modules
   *
   * @default true
   */
  experimental_json_modules?: Optional<boolean>

  /**
   * Enable support for network based modules.
   *
   * @see https://nodejs.org/docs/latest-v16.x/api/esm.html#https-and-http-imports
   *
   * @default false
   */
  experimental_network_imports?: Optional<boolean>

  /**
   * Enable support for WebAssembly modules.
   *
   * @see https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_wasm_modules
   *
   * @default false
   */
  experimental_wasm_modules?: Optional<boolean>

  /**
   * Map file extensions to module formats.
   *
   * @see {@linkcode Ext}
   * @see {@linkcode Format}
   *
   * @default EXTENSION_FORMAT_MAP
   */
  extension_format_map?: Optional<Map<EmptyString | Ext, Format>>

  /**
   * Return `undefined` when module format is not found, rather than `null`.
   *
   * An explicit `undefined` return value indicates [`load`][1] hooks should
   * re-run module format checks.
   *
   * [1]: https://nodejs.org/docs/latest-v16.x/api/esm.html#loadurl-context-nextload
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
  req?: Optional<RequestInit>
}

export type { GetFormatOptions as default }
