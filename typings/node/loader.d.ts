import type { Format } from '#src/types'

declare global {
  /**
   * Determines how `url` should be interpreted, retrieved, and parsed.
   * Also in charge of validating import assertions, `context.importAssertions`.
   *
   * @see https://nodejs.org/docs/latest-v16.x/api/all.html#all_esm_loadurl-context-defaultload
   *
   * @async
   *
   * @param {string} url - `file:` url of module
   * @param {LoadHookContext} context - Hook context
   * @param {(Format | null)?} [context.format] - Module format
   * @param {ImportAssertions} context.importAssertions - Import assertions map
   * @param {LoadHook} defaultLoad - Default Node.js `load` function
   * @return {Promise<LoadHookResult>} Hook result
   */
  declare type LoadHook = (
    url: string,
    context: LoadHookContext,
    defaultLoad: LoadHook
  ) => Promise<LoadHookResult>

  /**
   * {@link LoadHook} context.
   */
  declare interface LoadHookContext {
    /**
     * Module format.
     */
    format?: ResolveHookResult['format']

    /**
     * Import assertions map.
     */
    importAssertions?: ImportAssertions
  }

  /**
   * {@link LoadHook} result.
   */
  declare interface LoadHookResult {
    /**
     * Module format.
     */
    format: Format

    /**
     * Source code
     */
    source?: ArrayBuffer | Buffer | string | undefined
  }

  /**
   * Returns the resolved file URL for `specifier` and `context.parentURL` and,
   * optionally, its format as a hint to {@link LoadHook}.
   *
   * @see https://nodejs.org/docs/latest-v16.x/api/all.html#all_esm_resolvespecifier-context-defaultresolve
   *
   * @async
   *
   * @param {string} specifier - Module specifier
   * @param {ResolveHookContext} context - Hook context
   * @param {string[]} context.conditions - Import conditions
   * @param {ImportAssertions} context.importAssertions - Import assertions map
   * @param {string} [context.parentURL] - `file:` url of importer
   * @param {ResolveHook} defaultResolve - Node.js default resolver
   * @return {Promise<ResolveHookResult>} Hook result
   */
  declare type ResolveHook = (
    specifier: string,
    context: ResolveHookContext,
    defaultResolve: ResolveHook
  ) => Promise<ResolveHookResult>

  /**
   * {@link ResolveHook} context.
   */
  declare interface ResolveHookContext {
    /**
     * Import conditions.
     */
    conditions: Format | null

    /**
     * Import assertions map.
     */
    importAssertions: ImportAssertions

    /**
     * `file:` url of importer.
     */
    parentURL?: string
  }

  /**
   * {@link ResolveHook} result.
   */
  declare interface ResolveHookResult {
    /**
     * Module format.
     */
    format?: Format | null

    /**
     * Absolute url to import target.
     *
     * @example
     *  'file://...'
     */
    url: string
  }
}
