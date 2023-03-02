import type { Format } from '@flex-development/mlly'
import type { Nullable, TypedArray } from '@flex-development/tutils'

declare global {
  /**
   * {@linkcode LoadHook} context.
   */
  declare interface LoadHookContext {
    /**
     * Export conditions of relevant `package.json`.
     */
    conditions?: string[]

    /**
     * Module format.
     */
    format?: ResolveHookResult['format']

    /**
     * Import assertions map.
     */
    importAssertions: ImportAssertions
  }

  /**
   * {@linkcode LoadHook} result.
   */
  declare interface LoadHookResult {
    /**
     * Module format.
     */
    format: Format | Lowercase<keyof typeof Format>

    /**
     * Signal that the current {@linkcode ResolveHook} intends to terminate the
     * chain of resolve `hooks`.
     *
     * @default false
     */
    shortCircuit?: boolean | undefined

    /**
     * Source code for Node.js to evaluate.
     */
    source?: ArrayBuffer | TypedArray | string | undefined
  }

  /**
   * Determines how `url` should be interpreted, retrieved, and parsed.
   *
   * @see {@linkcode LoadHookContext}
   * @see https://nodejs.org/api/esm.html#loadurl-context-nextload
   *
   * @async
   *
   * @param {string} url - Resolved module URL
   * @param {LoadHookContext} context - Hook context
   * @param {LoadHook} nextLoad - Subsequent `load` hook in the chain or default
   * Node.js `load` hook after last user-supplied `load` hook
   * @return {Promise<LoadHookResult>} Hook result
   */
  declare type LoadHook = (
    url: string,
    context: LoadHookContext,
    defaultLoad: LoadHook
  ) => Promise<LoadHookResult>

  /**
   * {@linkcode ResolveHook} context.
   */
  declare interface ResolveHookContext {
    /**
     * Export conditions of relevant `package.json`.
     */
    conditions: string[]

    /**
     * Import assertions map.
     */
    importAssertions: ImportAssertions

    /**
     * URL of module importing the specifier to be resolved, or `undefined` if
     * the module specifier is the Node.js entry point.
     */
    parentURL?: string | undefined
  }

  /**
   * {@linkcode ResolveHook} result.
   */
  declare interface ResolveHookResult {
    /**
     * Module format hint for {@linkcode LoadHook}.
     *
     * **Note**: Hint may be ignored.
     */
    format?: Nullable<Format | Lowercase<keyof typeof Format>> | undefined

    /**
     * Signal that the current {@linkcode ResolveHook} intends to terminate the
     * chain of resolve `hooks`.
     *
     * @default false
     */
    shortCircuit?: boolean | undefined

    /**
     * Absolute URL to which module specifier resolved to.
     */
    url: string
  }

  /**
   * Resolves a file URL for a given module specifier and parent URL, and
   * optionally its format (such as `'module'`) as a hint to the `load` hook.
   *
   * @see {@linkcode ResolveHookContext}
   * @see https://nodejs.org/api/esm.html#resolvespecifier-context-nextresolve
   *
   * @async
   *
   * @param {string} specifier - Module specifier
   * @param {ResolveHookContext} context - Hook context
   * @param {ResolveHook} nextResolve - Subsequent `resolve` hook in the chain
   * or default Node.js `resolve` hook after last user-supplied `resolve` hook
   * @return {Promise<ResolveHookResult>} Hook result
   */
  declare type ResolveHook = (
    specifier: string,
    context: ResolveHookContext,
    nextResolve: ResolveHook
  ) => Promise<ResolveHookResult>
}
